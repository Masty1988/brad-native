export const analyzeMessage = (message, phoneNumber = null) => {
  const patterns = {
    urgency: {
      regex:
        /urgent|rapidement|immédiatement|vite|dans l'heure|expiré|expire|dernière chance|sous 24h|sous 48h/gi,
      weight: 20,
    },
    money: {
      regex:
        /virement|paypal|bitcoin|crypto|western union|money ?gram|carte bancaire|cb|iban|compte bancaire|€|euros?|dollars?|$/gi,
      weight: 25,
    },
    links: {
      regex:
        /https?:\/\/[^\s]+|cliquez ici|clique ici|suivez ce lien|ouvrir le lien|bit.ly|tinyurl/gi,
      weight: 15,
    },
    threats: {
      regex:
        /bloqué|suspendu|frauduleux|arnaque|police|justice|amende|poursuites|saisie|huissier/gi,
      weight: 22,
    },
    impersonation: {
      regex:
        /votre banque|votre compte|la poste|colissimo|amazon|netflix|impôts|caf|cpam|sécurité sociale/gi,
      weight: 18,
    },
    prizes: {
      regex:
        /gagné|gagnant|prix|loterie|tirage|récompense|cadeau gratuit|offre exclusive/gi,
      weight: 20,
    },
    personal_info: {
      regex:
        /confirmer|vérifier|mettre à jour|valider vos (informations|données|coordonnées)|mot de passe|code de sécurité/gi,
      weight: 23,
    },
    delivery_scam: {
      regex:
        /livreur|livraison|colis|paquet|transporteur|chronopost|dhl|fedex/gi,
      weight: 18,
    },
    door_recon: {
      regex:
        /vous êtes (chez vous|là|présent)|à la maison|chez vous en ce moment|vous rentrez à quelle heure|devant chez vous/gi,
      weight: 25,
    },
    impersonation_family: {
      regex:
        /(maman|papa|grand-?mère|grand-?père|c'est moi)|nouveau (numéro|téléphone)|cassé mon (téléphone|portable)/gi,
      weight: 24,
    },
    emergency_family: {
      regex:
        /accident|hôpital|urgence|prison|police m'a arrêté|besoin d'aide|envoie(-| )moi|caution/gi,
      weight: 23,
    },
    tech_support: {
      regex:
        /(microsoft|apple|windows|ordinateur).{0,30}(virus|infecté|bloqué)/gi,
      weight: 21,
    },
    vacation_recon: {
      regex:
        /partez en vacances|absent combien de temps|personne à la maison|quand revenez(-| )vous/gi,
      weight: 26,
    },
  };

  let score = 0;
  const reasons = [];
  const redFlags = [];
  const criticalWarnings = [];

  // Analyse numéro de téléphone
  if (phoneNumber && phoneNumber.trim()) {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)\.]/g, "");
    const suspiciousPrefixes = [
      "+225",
      "+234",
      "+233",
      "+237",
      "00225",
      "00234",
    ];

    for (const prefix of suspiciousPrefixes) {
      if (cleanPhone.startsWith(prefix)) {
        score += 25;
        reasons.push("Numéro de pays souvent utilisé pour arnaques");
        redFlags.push({ type: "suspicious_phone", severity: "high" });
        break;
      }
    }

    if (/(\d)\1{6,}/.test(cleanPhone)) {
      score += 15;
      reasons.push("Pattern de numéro suspect");
    }
  }

  // Analyse patterns
  Object.entries(patterns).forEach(([key, data]) => {
    const matches = message.match(data.regex);
    if (matches) {
      score += data.weight;
      reasons.push(`${key.replace("_", " ")} détecté`);
      redFlags.push({
        type: key,
        matches: matches.slice(0, 2),
        severity: data.weight >= 23 ? "critical" : "high",
      });

      if (key === "door_recon" || key === "vacation_recon") {
        criticalWarnings.push({
          type: "DANGER_CAMBRIOLAGE",
          message:
            "⚠️ ATTENTION : Tentative de repérage pour cambriolage possible !",
          action:
            "Ne répondez JAMAIS à ce type de question. Contactez la police si répété.",
        });
      }

      if (key === "impersonation_family") {
        criticalWarnings.push({
          type: "DANGER_USURPATION",
          message: "⚠️ Arnaque d'usurpation familiale très courante !",
          action: "Appelez votre proche sur son ANCIEN numéro pour vérifier.",
        });
      }
    }
  });

  const linkCount = (message.match(/https?:\/\//g) || []).length;
  const wordCount = message.split(/\s+/).length;

  if (wordCount < 30 && linkCount > 0) {
    score += 10;
    reasons.push("Message court avec lien");
  }

  const suspiciousDomains = message.match(
    /https?:\/\/[a-z0-9-]+\.(xyz|top|club|tk|ml|ga)/gi
  );
  if (suspiciousDomains) {
    score += 20;
    reasons.push("Domaine web très suspect");
    redFlags.push({ type: "dangerous_domain", severity: "critical" });
  }

  // Combo dangereux
  const hasUrgency = reasons.some((r) => r.includes("urgency"));
  const hasMoney = reasons.some((r) => r.includes("money"));
  const hasLink = reasons.some((r) => r.includes("links"));

  if (hasUrgency && hasMoney && hasLink) {
    score += 20;
    reasons.push("COMBO DANGEREUX : Urgence + Argent + Lien");
    criticalWarnings.push({
      type: "DANGEROUS_COMBO",
      message: "🚨 Combinaison très suspecte !",
      action: "ARNAQUE quasi-certaine. Supprimez immédiatement.",
    });
  }

  score = Math.min(score, 100);
  const isScam = score >= 40;
  const confidence = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  let recommendation;
  if (score >= 70) {
    recommendation = {
      action: "🚨 ARNAQUE - NE PAS RÉPONDRE",
      details: "Ce message est très probablement une arnaque.",
      tips: [
        "🚫 Ne cliquez sur AUCUN lien",
        "🚫 Ne communiquez AUCUNE information",
        "🚫 Ne rappelez PAS ce numéro",
        "✅ Bloquez immédiatement",
        "✅ Signalez sur signal-arnaques.com",
      ],
    };
  } else if (score >= 40) {
    recommendation = {
      action: "⚠️ TRÈS SUSPECT",
      details: "Plusieurs éléments suspects détectés.",
      tips: [
        "⚠️ N'ouvrez AUCUN lien",
        "⚠️ Ne donnez aucune information",
        "✅ Vérifiez l'identité de l'expéditeur",
        "✅ En cas de doute, ne répondez pas",
      ],
    };
  } else if (score >= 20) {
    recommendation = {
      action: "ℹ️ PRUDENCE",
      details: "Quelques éléments attirent l'attention.",
      tips: [
        "🔍 Vérifiez l'identité",
        "🔍 Méfiez-vous des demandes inhabituelles",
      ],
    };
  } else {
    recommendation = {
      action: "✅ Semble légitime",
      details: "Aucun signe évident d'arnaque.",
      tips: ["💡 Restez vigilant avec messages inconnus"],
    };
  }

  return {
    riskScore: score,
    isScam,
    confidence,
    reasons,
    redFlags,
    criticalWarnings,
    recommendation,
  };
};
