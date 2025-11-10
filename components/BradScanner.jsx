// ============================================
// components/BradScanner.jsx
// Module Scanner SMS - React Native
// ============================================

import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { analyzeMessage } from '../utils/scamDetector';

export default function BradScanner() {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const examples = [
    {
      label: "Arnaque colis 📦",
      text: "URGENT : Votre colis est en attente. Frais de réexpédition de 2.99€ à régler sous 48h. Cliquez ici : http://coliss-fr.xyz/track123",
      phone: "+22507123456"
    },
    {
      label: "Repérage domicile 🚨",
      text: "Bonjour, je suis le livreur Chronopost, vous êtes chez vous en ce moment ? Je suis devant votre porte.",
      phone: "0612345678"
    },
    {
      label: "Urgence familiale 👨‍👩‍👧",
      text: "Maman c'est moi, j'ai cassé mon téléphone, nouveau numéro. J'ai eu un accident, besoin urgent de 500€ pour l'hôpital",
      phone: "+234901234567"
    },
    {
      label: "Message légitime ✅",
      text: "Salut ! On se fait un ciné ce weekend ? J'ai vu qu'il y avait un bon film qui sort vendredi.",
      phone: ""
    }
  ];

  const handleAnalyze = () => {
    if (!message.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un message à analyser");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    setTimeout(() => {
      const result = analyzeMessage(message, phoneNumber);
      setAnalysis(result);
      setLoading(false);
    }, 1000);
  };

  const loadExample = (ex) => {
    setMessage(ex.text);
    setPhoneNumber(ex.phone);
    setAnalysis(null);
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#EF4444';
    if (score >= 40) return '#F97316';
    if (score >= 20) return '#EAB308';
    return '#10B981';
  };

  const getRiskBgColor = (score) => {
    if (score >= 70) return '#FEE2E2';
    if (score >= 40) return '#FFEDD5';
    if (score >= 20) return '#FEF3C7';
    return '#D1FAE5';
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return 'DANGER';
    if (score >= 40) return 'SUSPECT';
    if (score >= 20) return 'PRUDENCE';
    return 'OK';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Card principale */}
      <View style={styles.card}>
        {/* Message input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message suspect à analyser</Text>
          <TextInput
            style={styles.textarea}
            value={message}
            onChangeText={setMessage}
            placeholder="Collez le message reçu ici..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Phone input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Feather name="phone" size={16} color="#6B7280" />
            <Text style={styles.label}>Numéro de l'expéditeur</Text>
            <Text style={styles.optional}>(optionnel)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Ex: +33612345678 ou 0612345678"
            keyboardType="phone-pad"
          />
        </View>

        {/* Examples */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Essayez avec ces exemples :</Text>
          <View style={styles.examplesGrid}>
            {examples.map((ex, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.exampleButton}
                onPress={() => loadExample(ex)}
              >
                <Text style={styles.exampleButtonText}>{ex.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Analyze button */}
        <TouchableOpacity
          style={[styles.analyzeButton, (!message.trim() || loading) && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyse en cours...</Text>
            </>
          ) : (
            <>
              <Feather name="send" size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyser ce message</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {analysis && (
        <View style={styles.resultsContainer}>
          {/* Critical warnings */}
          {analysis.criticalWarnings && analysis.criticalWarnings.length > 0 && (
            <View style={styles.criticalWarning}>
              <View style={styles.criticalWarningContent}>
                <Feather name="alert-octagon" size={32} color="#fff" />
                <View style={styles.criticalWarningText}>
                  <Text style={styles.criticalWarningTitle}>ALERTE CRITIQUE</Text>
                  {analysis.criticalWarnings.map((warning, idx) => (
                    <View key={idx} style={styles.warningItem}>
                      <Text style={styles.warningMessage}>{warning.message}</Text>
                      <Text style={styles.warningAction}>{warning.action}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Main results card */}
          <View style={styles.card}>
            {/* Score */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreNumber, { color: getRiskColor(analysis.riskScore) }]}>
                  {analysis.riskScore}
                </Text>
                <Text style={styles.scoreLabel}>SCORE</Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(analysis.riskScore) }]}>
                <Text style={styles.riskBadgeText}>{getRiskLabel(analysis.riskScore)}</Text>
              </View>
            </View>

            {/* Recommendation */}
            <View style={[styles.recommendationBox, { backgroundColor: getRiskBgColor(analysis.riskScore) }]}>
              <View style={styles.recommendationHeader}>
                {analysis.riskScore >= 70 ? (
                  <Feather name="alert-triangle" size={24} color={getRiskColor(analysis.riskScore)} />
                ) : analysis.riskScore >= 40 ? (
                  <Feather name="alert-triangle" size={24} color={getRiskColor(analysis.riskScore)} />
                ) : (
                  <Feather name="check-circle" size={24} color={getRiskColor(analysis.riskScore)} />
                )}
                <View style={styles.recommendationTextContainer}>
                  <Text style={[styles.recommendationAction, { color: getRiskColor(analysis.riskScore) }]}>
                    {analysis.recommendation.action}
                  </Text>
                  <Text style={styles.recommendationDetails}>{analysis.recommendation.details}</Text>
                </View>
              </View>

              <View style={styles.tipsSection}>
                <Text style={styles.tipsTitle}>Que faire :</Text>
                {analysis.recommendation.tips.map((tip, idx) => (
                  <View key={idx} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Red flags */}
            {analysis.redFlags.length > 0 && (
              <View style={styles.flagsSection}>
                <View style={styles.flagsHeader}>
                  <Feather name="alert-triangle" size={20} color="#EF4444" />
                  <Text style={styles.flagsTitle}>
                    Signaux d'alerte détectés ({analysis.redFlags.length})
                  </Text>
                </View>
                {analysis.redFlags.slice(0, 5).map((flag, idx) => (
                  <View key={idx} style={[
                    styles.flagItem,
                    flag.severity === 'critical' && styles.flagItemCritical
                  ]}>
                    <Text style={styles.flagType}>{flag.type.replace('_', ' ')}</Text>
                    {flag.matches && (
                      <Text style={styles.flagMatches}>
                        Détecté : {flag.matches.join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Confidence */}
            <View style={styles.confidenceSection}>
              <Text style={styles.confidenceText}>
                Niveau de confiance : <Text style={styles.confidenceBold}>{analysis.confidence}</Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🛡️ Cette analyse ne remplace pas votre jugement.
        </Text>
        <Text style={styles.footerText}>
          En cas de doute sérieux, contactez les autorités.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  optional: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  textarea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    color: '#1F2937',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  examplesSection: {
    marginBottom: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  exampleButtonText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 8,
  },
  criticalWarning: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#991B1B',
  },
  criticalWarningContent: {
    flexDirection: 'row',
    gap: 12,
  },
  criticalWarningText: {
    flex: 1,
  },
  criticalWarningTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningItem: {
    marginBottom: 12,
  },
  warningMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningAction: {
    color: '#FEE2E2',
    fontSize: 14,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  recommendationTextContainer: {
    flex: 1,
  },
  recommendationAction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationDetails: {
    fontSize: 14,
    color: '#374151',
  },
  tipsSection: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tipBullet: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  flagsSection: {
    marginBottom: 16,
  },
  flagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  flagsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flagItem: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  flagItemCritical: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  flagType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  flagMatches: {
    fontSize: 12,
    color: '#6B7280',
  },
  confidenceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  confidenceBold: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});