import { BradColors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ARNAQUES_DATA = [
  {
    id: 1,
    icon: '📦',
    title: 'Arnaque au colis',
    description: 'Faux SMS de livraison demandant des frais',
    details: 'Les escrocs envoient des SMS type : "Votre colis rencontre un problème d\'affranchissement. Veuillez régler 2,99€ sous 24h via ce lien : suivi-poste-info.com". Le but est de voler vos numéros de carte bancaire.',
    tips: [
      'Les URL officielles finissent par .fr (laposte.fr, chronopost.fr)',
      'Un transporteur n\'utilise jamais un numéro de portable (06/07)',
      'Ne payez jamais de frais "sur le pouce" via un lien SMS',
      'En cas de doute, copiez le numéro de suivi sur le site officiel',
    ],
    danger: 'high',
  },
  {
    id: 2,
    icon: '👨‍👩‍👧',
    title: 'Arnaque "Coucou Maman"',
    description: 'Usurpation d\'identité d\'un proche',
    details: 'Vous recevez : "Coucou maman/papa, mon téléphone est cassé/tombé dans l\'eau. C\'est mon numéro provisoire. Envoie-moi un message sur WhatsApp au 07...". L\'escroc prétextera ensuite une urgence financière pour vous faire payer.',
    tips: [
      'Appelez TOUJOURS l\'ancien numéro pour vérifier',
      'Demandez une note vocale : "Envoie-moi un vocal pour prouver que c\'est toi"',
      'Posez une question personnelle intime (nom de l\'animal de compagnie...)',
      'Ne faites aucun virement instantané dans la panique',
    ],
    danger: 'high',
  },
  {
    id: 3,
    icon: '🏛️',
    title: 'Fausse administration',
    description: 'Ameli, Impôts, CAF, ANTAI...',
    details: 'SMS/Email type : "AMELI : Un remboursement de 34,90€ est en attente. Confirmez vos coordonnées." ou "ANTAI : Vous avez un retard de paiement sur votre dossier 4921...". Le site imite parfaitement le site officiel.',
    tips: [
      'L\'État n\'envoie jamais de lien de paiement direct par SMS',
      'Les sites officiels finissent OBLIGATOIREMENT par .gouv.fr',
      'L\'administration ne demande jamais vos infos bancaires par message',
      'Connectez-vous via l\'application officielle, jamais via le lien reçu',
    ],
    danger: 'high',
  },
  {
    id: 4,
    icon: '🏦',
    title: 'Faux conseiller bancaire',
    description: 'Spoofing du numéro de votre banque',
    details: 'Votre téléphone affiche le VRAI numéro de votre banque. Le faux conseiller vous dit : "Des mouvements suspects de 900€ sont en cours à l\'étranger. Nous devons annuler l\'opération". Il vous demande de valider une notif sur votre mobile.',
    tips: [
      'Raccrochez et rappelez votre banque vous-même',
      'Votre banque ne vous demandera JAMAIS de valider une opération pour l\'annuler',
      'Une validation mobile = Un paiement autorisé (jamais un remboursement)',
      'Ne donnez jamais vos codes reçus par SMS à voix haute',
    ],
    danger: 'high',
  },
  {
    id: 5,
    icon: '💼',
    title: 'Arnaque à l\'emploi',
    description: 'Offres trop belles pour être vraies',
    details: 'Message WhatsApp/Telegram : "Bonjour, nous recrutons à temps partiel. Gagnez 200€ à 800€/jour en likant des vidéos YouTube/TikTok". Après quelques tâches payées quelques euros, on vous demande de payer pour "débloquer" le niveau supérieur.',
    tips: [
      'Aucun recruteur sérieux ne démarche par messagerie cryptée (Telegram)',
      'Si on vous demande de payer pour travailler, c\'est une arnaque',
      'Vérifiez l\'email du recruteur (Gmail/Hotmail = Suspect)',
      'L\'argent facile sans compétence n\'existe pas',
    ],
    danger: 'medium',
  },
  {
    id: 6,
    icon: '🎁',
    title: 'Faux concours / Cadeaux',
    description: 'iPhone gratuit, tirage au sort...',
    details: 'Email ou Pop-up : "Félicitations ! Vous avez été tiré au sort pour gagner un iPhone 15 ou un Dyson. Réglez juste les frais de port de 1,95€". En payant, vous vous abonnez en réalité à un service caché facturé 50€/mois.',
    tips: [
      'Si c\'est trop beau pour être vrai, c\'est faux',
      'Lisez les petites lignes en bas de page (conditions d\'abonnement)',
      'On ne paie jamais pour recevoir un "cadeau"',
      'Surveillez vos relevés bancaires pour détecter les abonnements cachés',
    ],
    danger: 'medium',
  },
  {
    id: 7,
    icon: '💻',
    title: 'Faux support Microsoft',
    description: 'PC bloqué, fausse alerte virus',
    details: 'Une page bloque votre navigateur avec une alarme sonore : "ALERTE VIRUS ! Votre ordinateur est bloqué. Appelez le support Microsoft au 01...". Au téléphone, l\'escroc prend le contrôle de votre PC et vous facture un dépannage fictif.',
    tips: [
      'Microsoft/Apple n\'affichent jamais de numéro de téléphone en alerte',
      'Ne jamais appeler le numéro affiché sur une pop-up',
      'Faites "Ctrl + Alt + Suppr" ou redémarrez le PC pour fermer la page',
      'N\'installez JAMAIS de logiciel de contrôle (AnyDesk, TeamViewer)',
    ],
    danger: 'high',
  },
  {
    id: 8,
    icon: '🏠',
    title: 'Repérage cambriolage',
    description: 'Questions indiscrètes sur vos horaires',
    details: 'Un démarcheur (faux éboueur, faux agent EDF, sondage) sonne chez vous. Il pose des questions bizarres : "Vous travaillez le matin ?", "Vous partez en vacances cet été ?", "Combien de personnes vivent ici ?".',
    tips: [
      'Ne donnez jamais vos horaires ou dates de vacances',
      'Un vrai professionnel a une carte professionnelle officielle',
      'Ne laissez pas entrer d\'inconnus pour un "verre d\'eau" ou un "service"',
      'Signalez tout comportement suspect à la police (17)',
    ],
    danger: 'high',
  },
  {
    id: 9,
    icon: '🎓',
    title: 'Arnaque au CPF',
    description: 'Vol de vos crédits de formation',
    details: 'SMS/Appel : "Vos droits à la formation (2000€) vont expirer. Cliquez ici pour les réclamer". L\'escroc veut récupérer vos identifiants France Connect pour vider votre compte CPF en achetant des formations bidons.',
    tips: [
      'Vos droits CPF n\'expirent JAMAIS',
      'Il n\'y a qu\'un seul site officiel : moncompteformation.gouv.fr',
      'Ne donnez jamais votre numéro de Sécurité Sociale par téléphone',
      'Raccrochez au nez des démarchages téléphoniques sur le CPF',
    ],
    danger: 'medium',
  },
  {
    id: 10,
    icon: '💔',
    title: 'Arnaque aux sentiments',
    description: 'Faux amoureux en ligne (Brouteurs)',
    details: 'Une personne séduisante vous contacte sur les réseaux sociaux. Après des semaines de discussion virtuelle passionnée, elle a un problème : "Je suis bloqué à la douane", "Mon fils est malade", et demande de l\'argent via coupons PCS ou virement.',
    tips: [
      'N\'envoyez JAMAIS d\'argent à quelqu\'un que vous n\'avez jamais vu',
      'Faites une recherche d\'image inversée sur Google avec sa photo',
      'Refusez les excuses de caméra cassée pour éviter les appels vidéo',
      'Méfiez-vous des profils trop parfaits ou vivant à l\'étranger',
    ],
    danger: 'high',
  },
  {
    id: 11,
    icon: '👗',
    title: 'Arnaque Vinted / Leboncoin',
    description: 'Faux paiement sécurisé',
    details: 'Un acheteur veut votre article mais refuse le paiement intégré. Il propose Paylib/PayPal et vous envoie un lien SMS : "Fonds reçus, cliquez pour accepter". Le lien demande vos codes de carte bancaire pour soi-disant "créditer" votre compte.',
    tips: [
      'Restez TOUJOURS dans la messagerie de l\'application',
      'On n\'a jamais besoin de sa carte bancaire pour RECEVOIR de l\'argent',
      'Refusez de communiquer votre email ou numéro de téléphone',
      'Méfiez-vous des acheteurs qui paient plus cher que le prix',
    ],
    danger: 'medium',
  },
  {
    id: 12,
    icon: '📱',
    title: 'SIM Swapping',
    description: 'Vol de votre numéro de téléphone',
    details: 'Vous perdez soudainement tout réseau mobile. L\'escroc a contacté votre opérateur en se faisant passer pour vous et a transféré votre numéro sur SA carte SIM. Il reçoit désormais vos codes de validation bancaire (SMS 2FA).',
    tips: [
      'Si le réseau coupe longtemps, contactez votre opérateur d\'urgence',
      'Utilisez des applications d\'authentification (Google Auth) plutôt que les SMS',
      'Limitez les infos personnelles publiques sur les réseaux sociaux',
      'Activez un code PIN auprès de votre opérateur pour toute modif',
    ],
    danger: 'high',
  },
  {
    id: 13,
    icon: '📺',
    title: 'Phishing Netflix / Amazon',
    description: 'Faux problème de facturation',
    details: 'Email alarmiste : "Votre abonnement Netflix/Prime est suspendu. Dernier paiement refusé". Le lien mène vers une fausse page de connexion pour voler vos identifiants et votre carte bancaire.',
    tips: [
      'Regardez l\'adresse email de l\'expéditeur (souvent bizarre)',
      'Ne cliquez pas. Allez sur l\'appli officielle pour vérifier l\'état du compte',
      'Les fautes d\'orthographe sont souvent un indice',
      'Un service ne vous demande jamais votre mot de passe par mail',
    ],
    danger: 'medium',
  },
  {
    id: 14,
    icon: '🛡️',
    title: 'Faux Antivirus',
    description: 'Abonnement caché / Renouvellement',
    details: 'Email reçu : "Votre abonnement McAfee/Norton a expiré aujourd\'hui. Votre compte sera débité de 399€ pour le renouvellement auto". Paniqué, vous appelez le numéro fourni pour annuler, et on vous demande vos infos bancaires pour "rembourser".',
    tips: [
      'C\'est du spam. Vérifiez vos prélèvements réels avant de paniquer',
      'Ne jamais appeler un numéro trouvé dans un email non sollicité',
      'Les vrais antivirus ne menacent pas de prélèvements géants',
      'Marquez l\'email comme spam et supprimez-le',
    ],
    danger: 'low',
  },
];

export default function BradFeed() {
  const [expandedId, setExpandedId] = useState(null);

  const getDangerColor = (danger) => {
    switch (danger) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Types d'arnaques</Text>
        <Text style={styles.subtitle}>
          Apprenez à reconnaître les techniques des escrocs
        </Text>
      </View>

      {ARNAQUES_DATA.map((arnaque) => (
        <TouchableOpacity
          key={arnaque.id}
          style={styles.card}
          onPress={() => toggleExpand(arnaque.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{arnaque.icon}</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{arnaque.title}</Text>
              <Text style={styles.cardDescription}>{arnaque.description}</Text>
            </View>
            <View style={[styles.dangerBadge, { backgroundColor: getDangerColor(arnaque.danger) + '20' }]}>
              <View style={[styles.dangerDot, { backgroundColor: getDangerColor(arnaque.danger) }]} />
            </View>
            <Feather 
              name={expandedId === arnaque.id ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#9CA3AF" 
            />
          </View>

          {expandedId === arnaque.id && (
            <View style={styles.cardExpanded}>
              <Text style={styles.detailsText}>{arnaque.details}</Text>
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>💡 Comment se protéger :</Text>
                {arnaque.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Feather name="check" size={16} color="#10B981" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🛡️ En cas de doute, ne cliquez pas !
        </Text>
        <Text style={styles.footerSubtext}>
          Signalez sur signal-arnaques.com ou au 33700
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BradColors.grisClair,
    paddingBottom : 80,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  dangerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dangerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  tipsContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#047857',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  footerSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});