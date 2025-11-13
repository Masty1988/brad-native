import { BradColors } from '@/constants/colors';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BradLogo from './BradLogo';

export default function BradHeader() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <BradLogo width={120} height={40} />
      </View>
      
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BradColors.blanc,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BradColors.grisMoyen,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    height: 40,
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
