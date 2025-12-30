import { BradColors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BradLogo from './BradLogo';

export default function BradHeader({ onSettingsPress = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        
        <View style={styles.logoContainer}>
          <BradLogo width={120} height={40} />
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={onSettingsPress}
        >
          <Feather name="settings" size={22} color={BradColors.text.secondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: BradColors.blanc,
  },
  header: {
    backgroundColor: BradColors.blanc,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BradColors.grisMoyen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    width: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  settingsButton: {
    padding: 6,
  },
});