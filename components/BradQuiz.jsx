// ============================================
// components/BradQuiz.jsx
// Module Quiz Quotidien - React Native
// ============================================

import { BradColors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, Brain, CheckCircle, RefreshCw, TrendingUp, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchQuestions } from '../utils/quizApi';

export default function BradQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  useEffect(() => {
    loadStats();
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchQuestions();
      if (data && data.length > 0) {
        setQuestions(data);
        await loadTodayQuiz(data);
      } else {
        setError("Impossible de charger les questions");
      }
    } catch (err) {
      setError("Erreur de connexion");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const loadTodayQuiz = async (questionsData) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastQuizDate = await AsyncStorage.getItem('brad_last_quiz_date');
      
      if (lastQuizDate === today) {
        const savedAnswer = await AsyncStorage.getItem('brad_today_quiz_answer');
        const quizIndex = await AsyncStorage.getItem('brad_today_quiz_index');
        if (savedAnswer && quizIndex) {
          setCurrentQuiz(questionsData[parseInt(quizIndex)]);
          setIsAnswered(true);
          setSelectedAnswer(JSON.parse(savedAnswer));
        }
      } else {
        const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        const quizIndex = daysSinceEpoch % questionsData.length;
        setCurrentQuiz(questionsData[quizIndex]);
        await AsyncStorage.setItem('brad_today_quiz_index', quizIndex.toString());
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const handleAnswer = async (optionIndex) => {
    if (isAnswered) return;

    const isCorrect = optionIndex === currentQuiz.correctIndex;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('brad_last_quiz_date', today);
      await AsyncStorage.setItem('brad_today_quiz_answer', JSON.stringify(optionIndex));

      const newStats = {
        totalQuizzes: stats.totalQuizzes + 1,
        correctAnswers: stats.correctAnswers + (isCorrect ? 1 : 0),
        currentStreak: isCorrect ? stats.currentStreak + 1 : 0,
        bestStreak: isCorrect 
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

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement du quiz du jour...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuestions}>
          <RefreshCw size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuiz) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Préparation du quiz...</Text>
      </View>
    );
  }

  const diffColors = getDifficultyColor(currentQuiz.difficulty);
  const isCorrectAnswer = selectedAnswer === currentQuiz.correctIndex;

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

        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{currentQuiz.category}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuiz.correctIndex;
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
                <Text style={textStyle}>{option}</Text>
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
              isCorrectAnswer ? styles.explanationCorrect : styles.explanationWrong
            ]}>
              <View style={styles.explanationHeader}>
                {isCorrectAnswer ? (
                  <CheckCircle size={20} color="#059669" />
                ) : (
                  <XCircle size={20} color="#DC2626" />
                )}
                <Text style={[
                  styles.explanationTitle,
                  isCorrectAnswer ? styles.explanationTitleCorrect : styles.explanationTitleWrong
                ]}>
                  {isCorrectAnswer ? '✅ Bravo !' : '❌ Pas tout à fait'}
                </Text>
              </View>
              <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 À retenir</Text>
              <Text style={styles.tipText}>
                {currentQuiz.explanation}
              </Text>
            </View>

            <View style={styles.nextQuizBox}>
              <Text style={styles.nextQuizText}>Prochain quiz disponible demain ⏰</Text>
            </View>
          </View>
        )}
      </View>

      {/* Source */}
      <View style={styles.sourceBox}>
        <Text style={styles.sourceText}>
          📚 {questions.length} questions disponibles
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BradColors.grisClair,
  },
  contentContainer: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: BradColors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    backgroundColor: BradColors.blanc,
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
    marginBottom: 8,
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
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
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
  nextQuizBox: {
    alignItems: 'center',
  },
  nextQuizText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sourceBox: {
    alignItems: 'center',
    marginTop: 16,
  },
  sourceText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});