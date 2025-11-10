// ============================================
// BRAD. - APPLICATION REACT NATIVE COMPLÈTE
// ============================================
// Version 1.0 - Prêt pour Expo Go
//
// STRUCTURE DU PROJET :
//
// brad-native/
// ├── App.js (CE FICHIER - copier ici)
// ├── package.json (voir en bas)
// ├── utils/
// │   └── scamDetector.js (voir section 2)
// └── components/
//     ├── BradScanner.jsx (voir section 3)
//     ├── BradQuiz.jsx (voir section 4)
//     └── BradFeed.jsx (voir section 5)
//
// 1. CODE PRINCIPAL DE L'APPLICATION (App.js)

import { AlertTriangle, Brain, Shield } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import des composants (à créer)
import BradFeed from "./components/BradFeed";
import BradQuiz from "./components/BradQuiz";
import BradScanner from "./components/BradScanner";

export default function App() {
  const [activeTab, setActiveTab] = useState("scanner");

  const tabs = [
    { id: "scanner", label: "Scanner", icon: Shield },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "feed", label: "Arnaques", icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "scanner":
        return <BradScanner />;
      case "quiz":
        return <BradQuiz />;
      case "feed":
        return <BradFeed />;
      default:
        return <BradScanner />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header avec Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Brad<Text style={styles.logoDot}>.</Text>
          </Text>
        </View>
        <Text style={styles.subtitle}>Votre allié anti-scam</Text>
      </View>

      {/* Contenu */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Navigation Bottom */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon size={24} color={isActive ? "#fff" : "#6B7280"} />
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2563EB",
  },
  logoDot: {
    fontSize: 40,
    color: "#10B981",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: "#2563EB",
  },
  tabLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#fff",
  },
});
