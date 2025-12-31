import { BradColors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AboutScreenProps = {
  onClose: () => void;
};

export default function AboutScreen({ onClose }: AboutScreenProps) {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>À propos</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Logo et nom */}
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>Brad.</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.tagline}>Ton assistant anti-arnaques 🛡️</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>
              Brad t'aide à détecter les arnaques par SMS et à développer tes réflexes de cybersécurité grâce à un quiz quotidien.
            </Text>
          </View>

          {/* Développeur */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Développé par</Text>
            <View style={styles.devCard}>
              <Text style={styles.devName}>MastyWebDev</Text>
              <Text style={styles.devLocation}>📍 La Rochelle / Charente-Maritime</Text>
              <Text style={styles.devTagline}>Sites web pour artisans et TPE & apps mobiles 📱</Text>
            </View>
          </View>

          {/* Liens */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Me contacter</Text>
            
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openLink('https://mastywebdev.fr')}
            >
              <Feather name="globe" size={20} color={BradColors.bleuBrad} />
              <Text style={styles.linkText}>mastywebdev.fr</Text>
              <Feather name="external-link" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openLink('mailto:contact@mastywebdev.fr')}
            >
              <Feather name="mail" size={20} color={BradColors.bleuBrad} />
              <Text style={styles.linkText}>contact@mastywebdev.fr</Text>
              <Feather name="external-link" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openLink('https://www.linkedin.com/in/nicolas-mastywebdev')}
            >
              <Feather name="linkedin" size={20} color={BradColors.bleuBrad} />
              <Text style={styles.linkText}>LinkedIn</Text>
              <Feather name="external-link" size={16} color="#999" />
            </TouchableOpacity>
          </View>
          {/* Légal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations légales</Text>
              
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => openLink('https://mastywebdev.fr/brad/privacy')}
              >
                <Feather name="lock" size={20} color={BradColors.bleuBrad} />
                <Text style={styles.linkText}>Politique de confidentialité</Text>
                <Feather name="external-link" size={16} color="#999" />
              </TouchableOpacity>
            </View>

          {/* Signaler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ressources utiles</Text>
            
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openLink('https://www.signal-arnaques.com')}
            >
              <Feather name="alert-triangle" size={20} color="#F59E0B" />
              <Text style={styles.linkText}>Signal-Arnaques.com</Text>
              <Feather name="external-link" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openLink('https://www.cybermalveillance.gouv.fr')}
            >
              <Feather name="shield" size={20} color="#10B981" />
              <Text style={styles.linkText}>Cybermalveillance.gouv.fr</Text>
              <Feather name="external-link" size={16} color="#999" />
            </TouchableOpacity>
          </View>
          

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 MastyWebDev</Text>
            <Text style={styles.footerText}>Fait avec React Native & Expo</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: BradColors.bleuBrad,
  },
  version: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  devCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  devName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BradColors.bleuBrad,
  },
  devLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  devTagline: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});