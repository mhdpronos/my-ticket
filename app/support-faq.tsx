import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useHapticOnScroll } from '@/hooks/useHapticOnScroll';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const faqItems = [
  {
    question: 'Comment recevoir les tickets premium ?',
    answer:
      'Active un abonnement MY TICKET + pour accéder aux pronostics premium, aux cotes boostées et aux analyses détaillées.',
  },
  {
    question: 'Quand les pronostics sont-ils publiés ?',
    answer:
      'Nos experts publient les tickets en général 2 à 4 heures avant le coup d’envoi, selon la ligue et les informations disponibles.',
  },
  {
    question: 'Puis-je filtrer les matchs par pays ou ligue ?',
    answer:
      'Oui, utilise les filtres sur la page Matchs pour sélectionner les compétitions qui t’intéressent.',
  },
  {
    question: 'Comment est calculée la fiabilité d’un pronostic ?',
    answer:
      'La fiabilité combine nos analyses statistiques, la forme des équipes et les tendances de cotes des bookmakers partenaires.',
  },
  {
    question: 'Que signifie un ticket “Safe” ?',
    answer:
      'Un ticket Safe privilégie des sélections à risque maîtrisé pour maximiser la régularité plutôt que le gros gain.',
  },
  {
    question: 'Pourquoi certaines cotes changent-elles ?',
    answer:
      'Les cotes évoluent en fonction de la demande du marché, des compositions officielles et des dernières informations d’avant-match.',
  },
  {
    question: 'Comment sauvegarder mes matchs favoris ?',
    answer: 'Appuie sur l’icône étoile d’un match pour l’ajouter dans tes favoris.',
  },
  {
    question: 'Puis-je utiliser MY TICKET sur plusieurs appareils ?',
    answer: 'Oui, connecte-toi simplement avec le même compte pour retrouver ton historique et tes favoris.',
  },
  {
    question: 'Les pronostics garantissent-ils un gain ?',
    answer:
      'Non. Les pronostics sont des analyses et ne garantissent aucun résultat. Parie toujours de façon responsable.',
  },
  {
    question: 'Comment contacter le support rapidement ?',
    answer:
      'Rends-toi dans Support MY TICKET pour ouvrir WhatsApp ou envoyer un email à notre équipe.',
  },
];

export default function SupportFaqScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t } = useTranslation();
  const scrollHaptics = useHapticOnScroll();

  return (
    <ScrollView style={{ backgroundColor: background }} contentContainerStyle={styles.container} {...scrollHaptics}>
      <ScreenHeader title={t('supportFaqPageTitle')} subtitle={t('supportFaqPageSubtitle')} />
      <View style={styles.stack}>
        {faqItems.map((item) => (
          <View key={item.question} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">{item.question}</ThemedText>
            <ThemedText style={{ color: mutedText }}>{item.answer}</ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 16,
  },
  stack: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});
