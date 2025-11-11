import { StyleSheet, Text, View } from 'react-native';
import { BradColors } from '@/constants/colors';
import BradLogo from './BradLogo';

export default function BradHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <BradLogo width={120} height={40} />
      </View>
      <Text style={styles.subtitle}>Votre allié anti-scam</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BradColors.blanc,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BradColors.grisMoyen,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: BradColors.bleuBrad,
  },
  logoDot: {
    fontSize: 40,
    color: BradColors.vertBrad,
  },
  subtitle: {
    fontSize: 14,
    color: BradColors.text.secondary,
    fontWeight: '500',
  },
});
