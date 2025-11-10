// ============================================
// components/BradQuiz.jsx
// Module Quiz Quotidien - React Native
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, Brain, CheckCircle, TrendingUp, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const QUIZ_DATABASE = [
  {
    id: 1,
    date: '2025-11-04',
    question: "Vous recevez : 'Votre colis est bloqué en douane. Payez 2,99€ pour le débloquer : coliss-fr.xyz' - C'est une arnaque ?",
    options: [
      { text: "Oui, c'est une arnaque", correct: true },
      { text: "Non, c'est légitime", correct: false }
    ],
    explanation: "ARNAQUE ! Les vrais services de livraison n'utilisent jamais de domaines .xyz et ne demandent pas de paiement par SMS avec lien suspect.",
    tip: "Vérifiez toujours le domaine : La Poste = laposte.fr, Colissimo = colissimo.fr",
    difficulty: "facile"
  },
  {
    id: 2,
    date: '2025-11-05',
    question: "SMS de votre banque : 'Activité suspecte détectée. Confirmez vos coordonnées sur bnp-secure.com' - Que faire ?",
    options: [
      { text: "Cliquer et confirmer mes infos", correct: false },
      { text: "Appeler ma banque directement", correct: true },
      { text: "Répondre au SMS", correct: false }
    ],
    explanation: "TOUJOURS appeler votre banque au numéro officiel (sur votre carte). Les banques ne demandent JAMAIS vos infos par SMS.",
    tip: "Le bon réflexe : numéro officiel uniquement, jamais via SMS/email",
    difficulty: "moyen"
  },
  {
    id: 3,
    date: '2025-11-06',
    question: "'Maman c'est moi, j'ai cassé mon téléphone, nouveau numéro. Peux-tu m'envoyer 200€ urgent ?' - Arnaque ?",
    options: [
      { text: "Oui, arnaque classique", correct: true },
      { text: "Non, c'est vraiment mon enfant", correct: false }
    ],
    explanation: "ARNAQUE ULTRA-FRÉQUENTE ! Appellez TOUJOURS l'ancien numéro de votre proche avant tout virement.",
    tip: "Règle d'or : Argent + nouveau numéro = TOUJOURS vérifier par appel",
    difficulty: "facile"
  },
  {
    id: 4,
    date: '2025-11-07',
    question: "Quel domaine est légitime pour La Poste ?",
    options: [
      { text: "laposte-colis.com", correct: false },
      { text: "laposte.fr", correct: true },
      { text: "laposte-suivi.net", correct: false }
    ],
    explanation: "Seul laposte.fr est officiel ! Les variantes (.com, .net, -suivi) sont TOUTES des arnaques.",
    tip: "Astuce : Tapez toujours l'URL vous-même, ne cliquez jamais un lien",
    difficulty: "moyen"
  },
  {
    id: 5,
    date: '2025-11-08',
    question: "Vous êtes chez vous en ce moment ? Je suis le livreur Chronopost devant votre porte.' - Que faire ?",
    options: [
      { text: "Répondre 'Oui je descends'", correct: false },
      { text: "Ne JAMAIS répondre, c'est du repérage", correct: true },
      { text: "Demander le numéro de colis", correct: false }
    ],
    explanation: "DANGER ! C'est du repérage pour cambriolage. Les vrais livreurs sonnent, ils ne demandent pas par SMS si vous êtes là.",
    tip: "Jamais de réponse aux questions 'êtes-vous chez vous' par SMS !",
    difficulty: "difficile"
  }
];

export default function BradQuiz() {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  useEffect(() => {
    loadStats();
    loadTodayQuiz();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('brad_quiz_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTodayQuiz = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastQuizDate = await AsyncStorage.getItem('brad_last_quiz_date');
      
      if (lastQuizDate === today) {
        const savedAnswer = await AsyncStorage.getItem('brad_today_quiz_answer');
        const quizIndex = await AsyncStorage.getItem('brad_today_quiz_index');
        if (savedAnswer && quizIndex) {
          setCurrentQuiz(QUIZ_DATABASE[parseInt(quizIndex)]);
          setIsAnswered(true);
          setSelectedAnswer(JSON.parse(savedAnswer));
        }
      } else {
        const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        const quizIndex = daysSinceEpoch % QUIZ_DATABASE.length;
        setCurrentQuiz(QUIZ_DATABASE[quizIndex]);
        await AsyncStorage.setItem('brad_today_quiz_index', quizIndex.toString());
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const handleAnswer = async (optionIndex) => {
    if (isAnswered) return;

    const option = currentQuiz.options[optionIndex];
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('brad_last_quiz_date', today);
      await AsyncStorage.setItem('brad_today_quiz_answer', JSON.stringify(optionIndex));

      const newStats = {
        totalQuizzes: stats.totalQuizzes + 1,
        correctAnswers: stats.correctAnswers + (option.correct ? 1 : 0),
        currentStreak: option.correct ? stats.currentStreak + 1 : 0,
        bestStreak: option.correct 
          ? Math.max(stats.bestStreak, stats.currentStreak + 1)
          : stats.bestStreak
      };

      setStats(newStats);
      await AsyncStorage.setItem('brad_quiz_stats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'facile': return { bg: '#D1FAE5', text: '#065F46' };
      case 'moyen': return { bg: '#FEF3C7', text: '#92400E' };
      case 'difficile': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getSuccessRate = () => {
    if (stats.totalQuizzes === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalQuizzes) * 100);
  };

  if (!currentQuiz) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement du quiz du jour...</Text>
      </View>
    );
  }

  const diffColors = getDifficultyColor(currentQuiz.difficulty);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }]}>
          <Award size={24} color="#2563EB" />
          <Text style={[styles.statNumber, { color: '#1E40AF' }]}>{stats.currentStreak}</Text>
          <Text style={[styles.statLabel, { color: '#2563EB' }]}>Série actuelle</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
          <TrendingUp size={24} color="#059669" />
          <Text style={[styles.statNumber, { color: '#065F46' }]}>{getSuccessRate()}%</Text>
          <Text style={[styles.statLabel, { color: '#059669' }]}>Réussite</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#E9D5FF', borderColor: '#A855F7' }]}>
          <Brain size={24} color="#9333EA" />
          <Text style={[styles.statNumber, { color: '#7E22CE' }]}>{stats.bestStreak}</Text>
          <Text style={[styles.statLabel, { color: '#9333EA' }]}>Record</Text>
        </View>
      </View>

      {/* Quiz Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.quizHeader}>
          <View style={styles.quizTitleRow}>
            <Brain size={24} color="#2563EB" />
            <Text style={styles.quizTitle}>Quiz du Jour</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: diffColors.bg }]}>
            <Text style={[styles.difficultyText, { color: diffColors.text }]}>
              {currentQuiz.difficulty}
            </Text>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = option.correct;
            const showResult = isAnswered;

            let buttonStyle = [styles.optionButton];
            let textStyle = [styles.optionText];
            
            if (!showResult) {
              buttonStyle.push(styles.optionButtonActive);
            } else if (isSelected && isCorrect) {
              buttonStyle.push(styles.optionButtonCorrect);
              textStyle.push(styles.optionTextCorrect);
            } else if (isSelected && !isCorrect) {
              buttonStyle.push(styles.optionButtonWrong);
              textStyle.push(styles.optionTextWrong);
            } else if (isCorrect) {
              buttonStyle.push(styles.optionButtonCorrect);
              textStyle.push(styles.optionTextCorrect);
            } else {
              buttonStyle.push(styles.optionButtonInactive);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                <Text style={textStyle}>{option.text}</Text>
                {showResult && isCorrect && (
                  <CheckCircle size={20} color="#059669" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle size={20} color="#DC2626" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <View style={styles.explanationContainer}>
            <View style={[
              styles.explanationBox,
              currentQuiz.options[selectedAnswer].correct 
                ? styles.explanationCorrect 
                : styles.explanationWrong
            ]}>
              <View style={styles.explanationHeader}>
                {currentQuiz.options[selectedAnswer].correct ? (
                  <CheckCircle size={20} color="#059669" />
                ) : (
                  <XCircle size={20} color="#DC2626" />
                )}
                <Text style={[
                  styles.explanationTitle,
                  currentQuiz.options[selectedAnswer].correct 
                    ? styles.explanationTitleCorrect 
                    : styles.explanationTitleWrong
                ]}>
                  {currentQuiz.options[selectedAnswer].correct ? '✅ Bravo !' : '❌ Pas tout à fait'}
                </Text>
              </View>
              <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Conseil Brad.</Text>
              <Text style={styles.tipText}>{currentQuiz.tip}</Text>
            </View>

            <View style={styles.premiumBox}>
              <Text style={styles.premiumText}>
                <Text style={styles.premiumBold}>🎓 Brad. Premium</Text> : Quiz personnalisés basés sur tes scans + explications IA détaillées
              </Text>
              <TouchableOpacity>
                <Text style={styles.premiumLink}>Essayer 7 jours gratuits →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nextQuizBox}>
              <Text style={styles.nextQuizText}>Prochain quiz disponible demain à 9h ⏰</Text>
            </View>
          </View>
        )}
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  questionBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionButtonActive: {
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  optionButtonCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  optionButtonWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  optionButtonInactive: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextCorrect: {
    color: '#065F46',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  explanationContainer: {
    gap: 16,
  },
  explanationBox: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  explanationCorrect: {
    backgroundColor: '#D1FAE5',
    borderLeftColor: '#10B981',
  },
  explanationWrong: {
    backgroundColor: '#FEE2E2',
    borderLeftColor: '#EF4444',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  explanationTitleCorrect: {
    color: '#065F46',
  },
  explanationTitleWrong: {
    color: '#991B1B',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  premiumBox: {
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9D5FF',
  },
  premiumText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  premiumBold: {
    fontWeight: 'bold',
    color: '#7E22CE',
  },
  premiumLink: {
    fontSize: 12,
    color: '#7E22CE',
    fontWeight: '600',
  },
  nextQuizBox: {
    alignItems: 'center',
  },
  nextQuizText: {
    fontSize: 14,
    color: '#6B7280',
  },
});