const QUIZ_URL = 'https://raw.githubusercontent.com/Masty1988/brad-data/main/questions.json';

export const fetchQuestions = async () => {
  try {
    const response = await fetch(QUIZ_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur chargement questions:', error);
    return null;
  }
};

export const getRandomQuestions = async (count = 5, category = null) => {
  const questions = await fetchQuestions();
  if (!questions) return [];
  
  let filtered = questions;
  if (category) {
    filtered = questions.filter(q => q.category === category);
  }
  
  // Mélange et prend X questions
  return filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};