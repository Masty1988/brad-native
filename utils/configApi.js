const CONFIG_URL = 'https://raw.githubusercontent.com/Masty1988/brad-data/main/config.json';

let cachedConfig = null;

export const getConfig = async () => {
  if (cachedConfig) return cachedConfig;
  
  try {
    const response = await fetch(CONFIG_URL);
    const data = await response.json();
    cachedConfig = data;
    return data;
  } catch (error) {
    console.error('Erreur chargement config:', error);
    // Config par défaut si erreur
    return {
      appVersion: "1.0.0",
      downloadLink: "",
      shareMessage: "🛡️ Brad - Quiz Arnaque du jour #{day}\n{result}\n🔥 Série : {streak} jour(s)\n📊 Taux de réussite : {rate}%\n\n👉 Télécharge Brad pour te protéger des arnaques !",
      announcements: []
    };
  }
};