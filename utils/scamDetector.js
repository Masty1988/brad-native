const getFlagLabel = (type) => {
  const labels = {
    'suspicious_international_phone': '📞 Numéro international suspect',
    'fake_official_caps': '🏛️ Faux organisme officiel',
    'urgency': '⚡ Urgence artificielle',
    'aggressive_urgency': '🚨 Urgence agressive',
    'links': '🔗 Lien suspect',
    'shortened_url': '🔗 URL raccourcie',
    'fake_official_domain': '🌐 Domaine frauduleux',
    'scam_like_domain': '🌐 Domaine suspect',
    'money': '💰 Mention d\'argent',
    'easy_money': '💰 Argent facile',
    'threats': '⚠️ Menaces',
    'impersonation': '🎭 Usurpation d\'identité',
    'impersonation_family': '👨‍👩‍👧 Usurpation familiale',
    'anonymous_delivery': '📦 Livreur anonyme',
    'delivery_scam': '📦 Arnaque livraison',
    'door_recon': '🏠 Repérage domicile',
    'vacation_recon': '🏠 Repérage absence',
    'prizes': '🎁 Faux gain',
    'personal_info': '🔐 Demande d\'infos personnelles',
    'telegram_handle': '📱 Contact Telegram/WhatsApp',
    'emergency_family': '🆘 Urgence familiale',
    'tech_support': '💻 Faux support technique',
    'via_url': '🔗 Lien via...',
    'robot_like_pattern': '🤖 Pattern suspect',
    'suspicious_phone_pattern': '📞 Numéro anormal',
    'invalid_phone_format': '📞 Format invalide',
  };
  return labels[type] || type.replace(/_/g, ' ');
};
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
    fake_official_domain: {
      regex:
        /(ameli|impots?|caf|cpam|securite|sante|assurance|carte-vitale|formulaire)[a-z0-9\-]*\.(com|net|info|org|xyz|top)/gi,
      weight: 35,
      description: "Domaine suspect imitant administration française",
    },
    fake_subdomain_structure: {
      regex:
        /(centre-?tri|centre-?livraison|suivi-?colis|point-?relais|expediteur|depot)[a-z0-9\-]*[\-\.](colissimo|chronopost|laposte|dhl|ups)/gi,
      weight: 35,
      description: "Structure de domaine imitant un transporteur",
    },
    fake_international_tld: {
      regex:
        /(colissimo|chronopost|laposte|ameli|impots|caf)[a-z0-9\-]*\.(de|ru|cn|br|pl|it|es)/gi,
      weight: 40,
      description: "Service français avec TLD étranger suspect",
    },
    scam_like_domain: {
      regex:
        /\b[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)*\.(com|net|info|xyz|io|top|online|site|click)\b/gi,
      weight: 15,
      description: "Nom de domaine suspect avec tirets",
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
        /(ameli|impôts|caf|cpam).{0,50}(expiré|bloqué|suspendu|vérifi|cliqu)/gi,
      weight: 30,
      description: "Usurpation avec action suspecte",
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
    legitimate_mention: {
      regex: /(chronopost|colissimo|dhl).{0,30}(livr|colis|paquet)/gi,
      weight: -10,
      description: "Mention légitime transporteur",
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
    // ========================================
    // PATTERNS LÉGITIMITÉ (NOUVEAUX)
    // ========================================
    legitimate_tracking: {
      regex:
        /numéro de suivi|code de suivi|tracking|colis\s+[A-Z0-9]{6,}|code\s+\d{6}/gi,
      weight: -15,
      description: "✅ Numéro de suivi ou code retrait légitime",
    },
    legitimate_pickup_point: {
      regex:
        /(locker|point relais|relais colis|bureau de poste).{0,40}(code|retirez|disponible)/gi,
      weight: -15,
      description: "✅ Notification point de retrait légitime",
    },

    legitimate_appointment: {
      regex: /rendez-vous (confirmé|prévu)|prise de rendez-vous/gi,
      weight: -10,
      description: "✅ Rendez-vous légitime",
    },

    legitimate_delivery_notif: {
      regex:
        /(votre colis|votre commande).{0,30}(arrivera|sera livré|en cours)/gi,
      weight: -10,
      description: "✅ Notification livraison normale",
    },

    has_real_company_contact: {
      regex: /service client.*0[1-9]\d{8}|nous contacter au 0[1-9]/gi,
      weight: -15,
      description: "✅ Coordonnées service client",
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
          message: "Ce type de question est souvent associé à du repérage.",
          action: "Il est recommandé de ne pas répondre à ces questions personnelles.",
        });
      }

      if (key === "impersonation_family") {
        criticalWarnings.push({
          type: "DANGER_USURPATION",
          message: "Ce message ressemble à une usurpation d'identité familiale.",
          action: "Pensez à appeler votre proche sur son ancien numéro pour vérifier.",
        });
      }

      if (key === "anonymous_delivery") {
        criticalWarnings.push({
          type: "DANGER_FAUX_LIVREUR",
          message: "Un vrai livreur s'identifie généralement avec un numéro de suivi.",
          action: "En cas de doute, vérifiez sur le site officiel du transporteur.",
        });
      }
    }
  });

  // ========================================
  // ANALYSE DOMAINES WEB
  // ========================================

  // Domaines très suspects (TLD exotiques) - évite les doublons
const suspiciousDomains = message.match(
  /https?:\/\/[a-z0-9-]+\.(xyz|top|club|tk|ml|ga|info|de)/gi
);
const alreadyHasDomainFlag = redFlags.some(f => 
  f.type === 'scam_like_domain' || f.type === 'fake_official_domain'
);

if (suspiciousDomains && !alreadyHasDomainFlag) {
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
  // Liste BLANCHE étendue de domaines officiels
  const trustedDomains = [
    "mrcolis.fr",
    "laposte.fr",
    "chronopost.fr",
    "colissimo.fr",
    "amazon.fr",
    "amazon.com",
    "apple.com",
    "icloud.com",
    "ameli.fr",
    "impots.gouv.fr",
    "service-public.fr",
    "caf.fr",
    "pole-emploi.fr",
    "bnpparibas.net",
    "creditagricole.fr",
    "societegenerale.fr",
    "orange.fr",
    "free.fr",
    "sfr.fr",
    "bouyguestelecom.fr",
  ];

  // Vérifier domaines de confiance
  const domainMatches = message.match(/https?:\/\/([a-z0-9\-\.]+)/gi);
  if (domainMatches) {
    domainMatches.forEach((url) => {
      const domain = url.replace(/https?:\/\/(www\.)?/, "").split("/")[0];

      if (
        trustedDomains.some(
          (trusted) => domain === trusted || domain.endsWith("." + trusted)
        )
      ) {
        score -= 20;
        reasons.push(`✅ Domaine officiel: ${domain}`);
      }
    });
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
  const hasSuspiciousDomain = redFlags.some(
    (r) => r.type === "scam_like_domain"
  );
  const hasImpersonation = redFlags.some((r) => r.type === "impersonation");
  const hasTelegram = redFlags.some((r) => r.type === "telegram_handle");
  const hasDelivery = redFlags.some((r) => r.type === "delivery_scam");

  // COMBO 1 : Urgence + Usurpation + Domaine suspect
  if (hasUrgency && hasImpersonation && hasSuspiciousDomain) {
    score += 35;
    reasons.push("🚨 COMBO CRITIQUE : Urgence + Usurpation + Domaine suspect");
    criticalWarnings.push({
      type: "PHISHING_ATTEMPT",
      message: "Ce message présente plusieurs signaux de phishing.",
      action: "Il est fortement recommandé de ne pas cliquer sur les liens.",
    });
  }

  // COMBO 2 : Argent facile + Contact externe (Telegram/WhatsApp)
  if (hasTelegram && hasMoney) {
    score += 30;
    reasons.push("🚨 COMBO : Arnaque emploi fictif");
    criticalWarnings.push({
      type: "JOB_SCAM",
      message: "Ce type d'offre ressemble à une arnaque à l'emploi.",
      action: "Les entreprises légitimes ne recrutent généralement pas via Telegram.",
    });
  }

  // COMBO 3 : Livraison + Paiement (arnaque colis très courante)
  const hasPaymentRequest = /pay|réglez|payer|frais|€/.test(message);

  if (hasDelivery && hasPaymentRequest && hasLink) {
    score += 30;
    reasons.push("🚨 COMBO : Fausse livraison avec paiement");
    criticalWarnings.push({
      type: "FAKE_DELIVERY",
      message: "Ce message ressemble à une arnaque au faux colis.",
      action: "Les transporteurs ne demandent généralement pas de paiement par SMS.",
    });
  }
  // COMBO 4 : Urgence + Argent + Lien (garde l'ancien aussi)
  if (hasUrgency && hasMoney && hasLink) {
    score += 20;
    reasons.push("🚨 COMBO : Urgence + Argent + Lien");
  }

  // ========================================
  // CALCUL SCORE FINAL
  // ========================================

  score = Math.max(0, Math.min(score, 100)); // Entre 0 et 100
  const isScam = score >= 40;
  const confidence =
    score >= 70 ? "Élevée" : score >= 40 ? "Moyenne" : "Faible";

  // ========================================
  // RECOMMANDATIONS (VERSION GUIDE CALME)
  // ========================================

  let recommendation;
  if (score >= 70) {
    recommendation = {
      action: "Risque élevé détecté",
      details: "Ce message présente plusieurs caractéristiques typiques des arnaques connues.",
      tips: [
        "Évitez de cliquer sur les liens présents",
        "Ne partagez aucune information personnelle",
        "En cas de doute, contactez l'organisme par ses canaux officiels",
        "Vous pouvez signaler ce message sur signal-arnaques.com ou au 33700",
      ],
    };
  } else if (score >= 40) {
    recommendation = {
      action: "Plusieurs signaux suspects",
      details: "Ce message contient des éléments qui méritent votre attention.",
      tips: [
        "Prenez le temps de vérifier l'expéditeur",
        "Évitez de cliquer sur les liens sans vérification",
        "Contactez directement l'organisme concerné en cas de doute",
      ],
    };
  } else if (score >= 20) {
    recommendation = {
      action: "Quelques éléments à noter",
      details: "Le message semble correct mais certains points attirent l'attention.",
      tips: [
        "Vérifiez l'identité de l'expéditeur si vous ne le connaissez pas",
        "Restez attentif aux demandes inhabituelles",
      ],
    };
  } else {
    recommendation = {
      action: "Aucun signal suspect détecté",
      details: "Ce message ne présente pas de caractéristiques d'arnaque connues.",
      tips: [
        "Comme toujours, restez vigilant avec les messages inattendus",
        "Brad n'est pas infaillible, faites confiance à votre jugement",
      ],
    };
  }
    // Transformer les types en labels français
    const redFlagsWithLabels = redFlags.map(flag => ({
      ...flag,
      label: getFlagLabel(flag.type)
    }));
  return {
    riskScore: score,
    isScam,
    confidence,
    reasons,
    redFlags : redFlagsWithLabels,
    criticalWarnings,
    recommendation,
  };
};
