export const analyzeMessage = (message, phoneNumber = null) => {
  const patterns = {
    // ========================================
    // PATTERNS ARGENT & GAINS
    // ========================================
    easy_money: {
      regex:
        /(\d+\s*€|\€\s*\d+|euros?).*?(simple|facile|rapide|sans effort|temps partiel)|plus vous.*plus vous (gagnez|gagner)|ajouter.*produit.*€/gi,
      weight: 40,
      description: "Promesse d'argent facile",
    },

    // ========================================
    // PATTERNS CONTACT SUSPECT
    // ========================================
    telegram_handle: {
      regex:
        /(telegram|whatsapp)\s*[:\-]?\s*@[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+(?!\.[a-z]{2,})/gi,
      weight: 35,
      description: "Contact via Telegram/WhatsApp suspect",
    },
    fake_official_caps: {
      regex: /^\s*[A-Z\s]{3,}\s*:/,
      weight: 15,
      description: "Nom d'organisme en MAJUSCULES",
    },

    // ========================================
    // PATTERNS URGENCE & MENACE
    // ========================================
    urgency: {
      regex:
        /urgent|rapidement|immédiatement|vite|dans l'heure|expiré|expire|dernière chance|sous 24h|sous 48h|dernière relance|dernier rappel|plus que \d+h/gi,
      weight: 20,
      description: "Urgence artificielle",
    },

    aggressive_urgency: {
      regex:
        /dernière relance|dernier rappel|suspension.*droits?|avant (suspension|majoration)|plus que 24h/gi,
      weight: 25,
      description: "Urgence agressive avec menace",
    },

    // ========================================
    // PATTERNS LIENS & URLS
    // ========================================
    via_url: {
      regex: /\bvia\b.*?(https?:\/\/[^\s]+|[a-z0-9\-\.]+\.[a-z]{2,})/gi,
      weight: 25,
      description: "Formulation 'via' suspecte",
    },

    links: {
      regex:
        /https?:\/\/[^\s]+|cliquez ici|clique ici|suivez ce lien|ouvrir le lien/gi,
      weight: 15,
      description: "Lien présent dans le message",
    },

    shortened_url: {
      regex: /bit\.ly|tinyurl|is\.gd|pvr\.cx|goo\.gl/gi,
      weight: 15,
      description: "URL raccourcie suspecte",
    },
    scam_like_domain: {
      regex: /\b[a-z0-9]+-[a-z0-9]+\.((info|xyz|io|top|online|site|click))\b/gi,
      weight: 15,
      description: "Nom de domaine suspect imitant un organisme officiel",
    },
    robot_like_pattern: {
      regex: /\b[a-f0-9]{16,}\b/gi,
      weight: 30,
      description: "Pattern de type robot / code hash détecté",
    },

    // ========================================
    // PATTERNS ARGENT & PAIEMENT
    // ========================================
    money: {
      regex:
        /virement|paypal|bitcoin|crypto|western union|money ?gram|carte bancaire|cb|iban|compte bancaire|€|euros?|dollars?|\$/gi,
      weight: 25,
      description: "Mention d'argent ou paiement",
    },

    // ========================================
    // PATTERNS MENACES & INTIMIDATION
    // ========================================
    threats: {
      regex:
        /bloqué|suspendu|frauduleux|arnaque|police|justice|amende|poursuites|saisie|huissier/gi,
      weight: 22,
      description: "Menaces ou intimidation",
    },

    // ========================================
    // PATTERNS USURPATION D'IDENTITÉ
    // ========================================
    impersonation: {
      regex:
        /votre banque|votre compte|la poste|colissimo|amazon|netflix|impôts|caf|cpam|sécurité sociale|ameli/gi,
      weight: 18,
      description: "Usurpation d'organisme officiel",
    },

    anonymous_delivery: {
      regex:
        /bonjour c'est le (livreur|coursier)|je suis le (livreur|coursier)/gi,
      weight: 25,
      description: "Livreur anonyme suspect",
    },

    impersonation_family: {
      regex:
        /(maman|papa|grand-?mère|grand-?père|c'est moi)|nouveau (numéro|téléphone)|cassé mon (téléphone|portable)/gi,
      weight: 24,
      description: "Usurpation identité familiale",
    },

    // ========================================
    // PATTERNS GAINS & PRIX
    // ========================================
    prizes: {
      regex:
        /gagné|gagnant|prix|loterie|tirage|récompense|cadeau gratuit|offre exclusive/gi,
      weight: 20,
      description: "Faux gains ou prix",
    },

    // ========================================
    // PATTERNS INFORMATIONS PERSONNELLES
    // ========================================
    personal_info: {
      regex:
        /confirmer|vérifier|mettre à jour|valider vos (informations|données|coordonnées)|mot de passe|code de sécurité/gi,
      weight: 23,
      description: "Demande d'informations personnelles",
    },

    // ========================================
    // PATTERNS LIVRAISON
    // ========================================
    delivery_scam: {
      regex:
        /livreur|livraison|colis|paquet|transporteur|chronopost|dhl|fedex|mondial relay/gi,
      weight: 18,
      description: "Contexte livraison",
    },

    // ========================================
    // PATTERNS REPÉRAGE CAMBRIOLAGE
    // ========================================
    door_recon: {
      regex:
        /vous êtes (chez vous|là|présent)|à la maison|chez vous en ce moment|vous rentrez à quelle heure|devant chez vous/gi,
      weight: 25,
      description: "Tentative de repérage domicile",
    },

    vacation_recon: {
      regex:
        /partez en vacances|absent combien de temps|personne à la maison|quand revenez(-| )vous/gi,
      weight: 26,
      description: "Tentative de repérage absence",
    },

    // ========================================
    // PATTERNS URGENCE FAMILIALE
    // ========================================
    emergency_family: {
      regex:
        /accident|hôpital|urgence|prison|police m'a arrêté|besoin d'aide|envoie(-| )moi|caution/gi,
      weight: 23,
      description: "Urgence familiale fictive",
    },

    // ========================================
    // PATTERNS SUPPORT TECHNIQUE
    // ========================================
    tech_support: {
      regex:
        /(microsoft|apple|windows|ordinateur).{0,30}(virus|infecté|bloqué)/gi,
      weight: 21,
      description: "Faux support technique",
    },
  };

  let score = 0;
  const reasons = [];
  const redFlags = [];
  const criticalWarnings = [];

  // ========================================
  // ANALYSE NUMÉRO DE TÉLÉPHONE
  // ========================================
  if (phoneNumber && phoneNumber.trim()) {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)\.]/g, "");

    // Numéros internationaux suspects
    const suspiciousPrefixes = [
      "+225",
      "+234",
      "+233",
      "+237",
      "+63",
      "00225",
      "00234",
      "00233",
      "00237",
      "0063",
    ];

    for (const prefix of suspiciousPrefixes) {
      if (cleanPhone.startsWith(prefix)) {
        score += 30;
        reasons.push("Numéro international souvent utilisé pour arnaques");
        redFlags.push({
          type: "suspicious_international_phone",
          severity: "high",
          matches: [phoneNumber],
        });
        break;
      }
    }

    // Numéros fixes français (légitimité)
    const frenchLandlineRegex = /^(\+33|0033|0)[1-5]\d{8}$/;
    if (frenchLandlineRegex.test(cleanPhone)) {
      score -= 20; // Réduit la suspicion
      reasons.push("✅ Numéro fixe français (signe de légitimité)");
    }

    // Pattern de numéro suspect (trop de chiffres identiques)
    if (/(\d)\1{6,}/.test(cleanPhone)) {
      score += 15;
      reasons.push("Pattern de numéro anormal");
      redFlags.push({ type: "suspicious_phone_pattern", severity: "medium" });
    }

    // Format de numéro bizarre (trop long)
    if (cleanPhone.length > 15) {
      score += 20;
      reasons.push("Format de numéro invalide");
      redFlags.push({ type: "invalid_phone_format", severity: "high" });
    }
  }

  // ========================================
  // ANALYSE DES PATTERNS DE MESSAGE
  // ========================================
  Object.entries(patterns).forEach(([key, data]) => {
    const matches = message.match(data.regex);
    if (matches) {
      score += data.weight;
      reasons.push(data.description);
      redFlags.push({
        type: key,
        matches: matches.slice(0, 2).map((m) => m.substring(0, 50)), // Limite longueur
        severity: data.weight >= 23 ? "critical" : "high",
      });

      // Alertes critiques spécifiques
      if (key === "door_recon" || key === "vacation_recon") {
        criticalWarnings.push({
          type: "DANGER_CAMBRIOLAGE",
          message: "🚨 ATTENTION : Tentative de repérage pour cambriolage !",
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

      if (key === "anonymous_delivery") {
        criticalWarnings.push({
          type: "DANGER_FAUX_LIVREUR",
          message:
            "⚠️ Les vrais livreurs s'identifient avec nom de société et numéro de suivi !",
          action:
            "N'ouvrez PAS. Vérifiez sur le site officiel du transporteur.",
        });
      }
    }
  });

  // ========================================
  // ANALYSE DOMAINES WEB
  // ========================================

  // Domaines très suspects (TLD exotiques)
  const suspiciousDomains = message.match(
    /https?:\/\/[a-z0-9-]+\.(xyz|top|club|tk|ml|ga|info|de)/gi
  );
  if (suspiciousDomains) {
    // Vérifier si c'est un TLD bizarre pour un service français
    const hasFrenchContext =
      /colissimo|laposte|chronopost|ameli|impots|caf|bnp|credit.agricole/gi.test(
        message
      );
    if (hasFrenchContext) {
      score += 30;
      reasons.push("Domaine suspect imitant service français");
      redFlags.push({
        type: "dangerous_domain_impersonation",
        severity: "critical",
      });
    } else {
      score += 20;
      reasons.push("Extension de domaine suspecte");
      redFlags.push({ type: "suspicious_domain", severity: "high" });
    }
  }

  // Domaines officiels (légitimité)
  const officialDomains = message.match(
    /https?:\/\/(www\.)?(amazon\.fr|apple\.com|chronopost\.fr|laposte\.fr|ca-cmds\.fr)/gi
  );
  if (officialDomains) {
    score -= 15; // Réduit la suspicion
    reasons.push("✅ Domaine officiel détecté");
  }

  // ========================================
  // ANALYSE STRUCTURE DU MESSAGE
  // ========================================

  const linkCount = (message.match(/https?:\/\//g) || []).length;
  const wordCount = message.split(/\s+/).length;

  // Message court avec lien = suspect
  if (wordCount < 30 && linkCount > 0) {
    score += 10;
    reasons.push("Message très court avec lien");
  }

  // Plusieurs liens dans un SMS = très suspect
  if (linkCount >= 2) {
    score += 15;
    reasons.push("Plusieurs liens dans le message");
  }

  // ========================================
  // DÉTECTION COMBOS DANGEREUX
  // ========================================

  const hasUrgency = redFlags.some((r) => r.type.includes("urgency"));
  const hasMoney = redFlags.some(
    (r) => r.type === "money" || r.type === "easy_money"
  );
  const hasLink = redFlags.some(
    (r) => r.type === "links" || r.type === "via_url"
  );
  const hasTelegram = redFlags.some((r) => r.type === "telegram_handle");

  // COMBO 1 : Urgence + Argent + Lien
  if (hasUrgency && hasMoney && hasLink) {
    score += 20;
    reasons.push("🚨 COMBO DANGEREUX : Urgence + Argent + Lien");
    criticalWarnings.push({
      type: "DANGEROUS_COMBO",
      message: "🚨 Combinaison typique d'arnaque !",
      action: "ARNAQUE quasi-certaine. Supprimez immédiatement.",
    });
  }

  // COMBO 2 : Argent facile + Telegram
  if (hasTelegram && hasMoney) {
    score += 25;
    reasons.push("🚨 COMBO : Argent + Contact Telegram");
    criticalWarnings.push({
      type: "JOB_SCAM",
      message: "⚠️ Arnaque à l'emploi fictif classique !",
      action: "Aucune entreprise légitime ne recrute par Telegram.",
    });
  }

  // ========================================
  // CALCUL SCORE FINAL
  // ========================================

  score = Math.max(0, Math.min(score, 100)); // Entre 0 et 100
  const isScam = score >= 40;
  const confidence =
    score >= 70 ? "Élevée" : score >= 40 ? "Moyenne" : "Faible";

  // ========================================
  // RECOMMANDATIONS
  // ========================================

  let recommendation;
  if (score >= 70) {
    recommendation = {
      action: "🚨 ARNAQUE - NE PAS RÉPONDRE",
      details: "Ce message est très probablement une arnaque.",
      tips: [
        "🚫 Ne cliquez sur AUCUN lien",
        "🚫 Ne communiquez AUCUNE information",
        "🚫 Ne rappelez PAS ce numéro",
        "✅ Bloquez immédiatement l'expéditeur",
        "✅ Signalez sur signal-arnaques.com ou 33700",
      ],
    };
  } else if (score >= 40) {
    recommendation = {
      action: "⚠️ TRÈS SUSPECT",
      details: "Plusieurs éléments suspects détectés.",
      tips: [
        "⚠️ N'ouvrez AUCUN lien",
        "⚠️ Ne donnez aucune information personnelle",
        "✅ Vérifiez l'identité de l'expéditeur par un autre moyen",
        "✅ En cas de doute, ne répondez pas",
      ],
    };
  } else if (score >= 20) {
    recommendation = {
      action: "ℹ️ PRUDENCE",
      details: "Quelques éléments attirent l'attention.",
      tips: [
        "🔍 Vérifiez l'identité de l'expéditeur",
        "🔍 Méfiez-vous des demandes inhabituelles",
        "💡 En cas de doute, contactez l'organisme directement",
      ],
    };
  } else {
    recommendation = {
      action: "✅ Semble légitime",
      details: "Aucun signe évident d'arnaque détecté.",
      tips: [
        "💡 Restez vigilant avec les messages d'inconnus",
        "🔍 Vérifiez toujours les liens avant de cliquer",
      ],
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
