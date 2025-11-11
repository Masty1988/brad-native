// ============================================
// components/BradFeed.jsx
// Module Feed Arnaques du Jour - React Native
// ============================================

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BradColors } from '@/constants/colors';

const SCAM_FEED = [
  {
    id: 1,
    date: '2025-11-04',
    title: "Faux SMS Chronopost avec repérage domicile",
    category: "Livraison",
    severity: "critique",
    example: "Bonjour, je suis votre livreur Chronopost. Vous êtes chez vous en ce moment ? Je suis devant votre porte.",
    dangerLevel: 95,
    victims: 1247,
    explanation: "Cette arnaque combine phishing ET repérage pour cambriolage. Les scammers vérifient si vous êtes absent pour préparer un vol.",
    whatToDo: [
      "Ne JAMAIS répondre à ce type de question",
      "Les vrais livreurs sonnent, ils n'envoient pas de SMS",
      "Signalez au 33700 (service anti-spam)",
      "Si répété : contactez la police"
    ],
    redFlags: [
      "Question 'êtes-vous chez vous ?'",
      "Numéro mobile (pas fixe professionnel)",
      "Pas de numéro de colis mentionné"
    ],
    trending: true
  },
  {
    id: 2,
    date: '2025-11-03',
    title: "Phishing CPAM : Faux remboursement santé",
    category: "Sécurité sociale",
    severity: "élevé",
    example: "CPAM : Vous avez droit à un remboursement de 87,50€. Validez vos données sur cpam-rembours.com avant le 05/11",
    dangerLevel: 85,
    victims: 892,
    explanation: "Site frauduleux qui vole vos données CPAM + carte vitale. Le vrai site est ameli.fr uniquement.",
    whatToDo: [
      "Ne JAMAIS cliquer sur un lien CPAM par SMS",
      "Connectez-vous sur ameli.fr directement",
      "La CPAM ne demande JAMAIS de confirmation par SMS",
      "Vérifiez sur votre compte Ameli officiel"
    ],
    redFlags: [
      "Domaine suspect (pas ameli.fr)",
      "Urgence artificielle (date limite)",
      "Montant précis pour crédibilité"
    ],
    trending: false
  },
  {
    id: 3,
    date: '2025-11-02',
    title: "Arnaque 'Maman nouveau numéro' avec urgence",
    category: "Famille",
    severity: "critique",
    example: "Maman c'est moi, j'ai cassé mon téléphone. Nouveau numéro : +234... J'ai eu un accident, peux-tu m'envoyer 300€ urgent pour l'hôpital ?",
    dangerLevel: 92,
    victims: 654,
    explanation: "Arnaque émotionnelle ultra-répandue. Les scammers exploitent le lien familial pour créer la panique et obtenir un virement rapide.",
    whatToDo: [
      "TOUJOURS appeler l'ancien numéro en premier",
      "Ne jamais envoyer d'argent sans vérification vocale",
      "Posez une question que seul votre proche connaît",
      "Prévenez votre famille de cette technique"
    ],
    redFlags: [
      "Numéro étranger (+234 Nigeria typique)",
      "Urgence médicale/argent combinés",
      "Pas de possibilité d'appel ('téléphone cassé')"
    ],
    trending: true
  }
];

export default function BradFeed() {
  const [selectedScam, setSelectedScam] = useState(SCAM_FEED[0]);
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem('brad_bookmarked_scams');
      if (saved) setBookmarked(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async (scamId) => {
    try {
      const newBookmarks = bookmarked.includes(scamId)
        ? bookmarked.filter(id => id !== scamId)
        : [...bookmarked, scamId];
      
      setBookmarked(newBookmarks);
      await AsyncStorage.setItem('brad_bookmarked_scams', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const shareScam = async (scam) => {
    try {
      await Share.share({
        title: `Alerte Brad. : ${scam.title}`,
        message: `⚠️ ARNAQUE DÉTECTÉE par Brad.\n\n${scam.title}\n\nExemple : "${scam.example}"\n\nNe tombez pas dans le piège !`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critique': return '#EF4444';
      case 'élevé': return '#F97316';
      case 'moyen': return '#EAB308';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar - Liste */}
      <ScrollView style={styles.sidebar} contentContainerStyle={styles.sidebarContent}>
        <View style={styles.sidebarHeader}>
          <Feather name="alert-triangle" size={20} color="#EF4444" />
          <Text style={styles.sidebarTitle}>Arnaques récentes</Text>
        </View>

        {SCAM_FEED.map((scam) => (
          <TouchableOpacity
            key={scam.id}
            style={[
              styles.scamItem,
              selectedScam.id === scam.id && styles.scamItemActive
            ]}
            onPress={() => setSelectedScam(scam)}
          >
            <View style={styles.scamItemHeader}>
              <Text style={styles.scamCategory}>{scam.category}</Text>
              {scam.trending && (
                <Feather name="trending-up" size={16} color="#EF4444" />
              )}
            </View>
            <Text style={styles.scamItemTitle} numberOfLines={2}>{scam.title}</Text>
            <View style={styles.scamItemFooter}>
              <View style={styles.scamItemDate}>
                <Feather name="clock" size={12} color="#6B7280" />
                <Text style={styles.scamItemDateText}>
                  {new Date(scam.date).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <View style={[styles.scamItemBadge, { backgroundColor: getSeverityColor(scam.severity) }]}>
                <Text style={styles.scamItemBadgeText}>{scam.dangerLevel}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content - Détail */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{selectedScam.category}</Text>
              </View>
              {selectedScam.trending && (
                <View style={styles.trendingBadge}>
                  <Feather name="trending-up" size={12} color="#EF4444" />
                  <Text style={styles.trendingText}>Tendance</Text>
                </View>
              )}
            </View>
            <View style={styles.cardHeaderActions}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  bookmarked.includes(selectedScam.id) && styles.iconButtonActive
                ]}
                onPress={() => toggleBookmark(selectedScam.id)}
              >
                <Feather 
                  name="bookmark" 
                  size={20} 
                  color={bookmarked.includes(selectedScam.id) ? '#fff' : '#6B7280'} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => shareScam(selectedScam)}
              >
                <Feather name="share-2" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.scamTitle}>{selectedScam.title}</Text>

          <View style={styles.scamMeta}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                {new Date(selectedScam.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </Text>
            </View>
            <Text style={styles.metaVictims}>{selectedScam.victims} victimes</Text>
          </View>

          {/* Danger meter */}
          <View style={styles.dangerMeter}>
            <View style={styles.dangerMeterHeader}>
              <Text style={styles.dangerMeterLabel}>Niveau de danger</Text>
              <Text style={[styles.dangerMeterValue, { color: getSeverityColor(selectedScam.severity) }]}>
                {selectedScam.dangerLevel}%
              </Text>
            </View>
            <View style={styles.dangerMeterBar}>
              <View 
                style={[
                  styles.dangerMeterFill, 
                  { 
                    width: `${selectedScam.dangerLevel}%`,
                    backgroundColor: getSeverityColor(selectedScam.severity)
                  }
                ]} 
              />
            </View>
          </View>

          {/* Example */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="alert-triangle" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Exemple de message</Text>
            </View>
            <View style={styles.exampleBox}>
              <Text style={styles.exampleText}>"{selectedScam.example}"</Text>
            </View>
          </View>

          {/* Explanation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Pourquoi c'est dangereux</Text>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>{selectedScam.explanation}</Text>
            </View>
          </View>

          {/* Red flags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚩 Signaux d'alerte à repérer</Text>
            {selectedScam.redFlags.map((flag, idx) => (
              <View key={idx} style={styles.flagItem}>
                <Text style={styles.flagIcon}>⚠️</Text>
                <Text style={styles.flagText}>{flag}</Text>
              </View>
            ))}
          </View>

          {/* What to do */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Que faire si vous recevez ce message</Text>
            {selectedScam.whatToDo.map((action, idx) => (
              <View key={idx} style={styles.actionItem}>
                <View style={styles.actionNumber}>
                  <Text style={styles.actionNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          {/* Premium CTA */}
          <View style={styles.premiumBox}>
            <Text style={styles.premiumTitle}>🔔 Brad. Premium : Alertes en temps réel</Text>
            <Text style={styles.premiumText}>
              Recevez des notifications push dès qu'une nouvelle arnaque est détectée dans votre région
            </Text>
            <TouchableOpacity>
              <Text style={styles.premiumLink}>Activer les alertes (7 jours gratuits) →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BradColors.grisClair,
  },
  sidebar: {
    width: 140,
    backgroundColor: BradColors.blanc,
    borderRightWidth: 1,
    borderRightColor: BradColors.grisMoyen,
  },
  sidebarContent: {
    padding: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scamItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  scamItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  scamItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scamCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  scamItemTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  scamItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scamItemDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scamItemDateText: {
    fontSize: 10,
    color: '#6B7280',
  },
  scamItemBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scamItemBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: BradColors.blanc,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  trendingBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  cardHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#2563EB',
  },
  scamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  scamMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  metaVictims: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  dangerMeter: {
    marginBottom: 24,
  },
  dangerMeterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dangerMeterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dangerMeterValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dangerMeterBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  dangerMeterFill: {
    height: '100%',
    borderRadius: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  exampleText: {
    fontSize: 14,
    color: '#1F2937',
    fontStyle: 'italic',
  },
  explanationBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  flagItem: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
    marginBottom: 8,
    gap: 8,
  },
  flagIcon: {
    fontSize: 16,
  },
  flagText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: 8,
    gap: 12,
  },
  actionNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  premiumBox: {
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9D5FF',
  },
  premiumTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
  },
  premiumLink: {
    fontSize: 12,
    color: '#7E22CE',
    fontWeight: '600',
  },
});