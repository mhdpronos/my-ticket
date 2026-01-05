import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';

// Écran des paramètres complet avec des sections modifiables et prêtes à brancher sur une API.

export default function EcranParametres() {
  const background = useCouleurTheme({}, 'background');
  const backgroundSecondary = useCouleurTheme({}, 'backgroundSecondary');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const tint = useCouleurTheme({}, 'tint');
  const success = useCouleurTheme({}, 'success');

  const [notificationsPush, setNotificationsPush] = useState(true);
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsWhatsapp, setNotificationsWhatsapp] = useState(false);
  const [biometrie, setBiometrie] = useState(false);
  const [doubleAuthentification, setDoubleAuthentification] = useState(true);
  const [modeSombre, setModeSombre] = useState(false);
  const [modePrive, setModePrive] = useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TexteTheme type="title">Paramètres</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>
          Personnalise ton expérience et gère la sécurité de ton compte.
        </TexteTheme>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="account-cog-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Compte</TexteTheme>
        </View>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="lock-reset" size={18} color={tint} />
            <TexteTheme>Modifier le mot de passe</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="credit-card-outline" size={18} color={tint} />
            <TexteTheme>Moyens de paiement</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={18} color={tint} />
            <TexteTheme>Adresse de facturation</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Sécurité</TexteTheme>
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Double authentification</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Protection renforcée du compte</TexteTheme>
          </View>
          <Switch value={doubleAuthentification} onValueChange={setDoubleAuthentification} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Connexion biométrique</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Empreinte ou Face ID</TexteTheme>
          </View>
          <Switch value={biometrie} onValueChange={setBiometrie} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Mode privé</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Masquer les gains sur l’écran</TexteTheme>
          </View>
          <Switch value={modePrive} onValueChange={setModePrive} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Notifications</TexteTheme>
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Push</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Alertes de tickets et cotes</TexteTheme>
          </View>
          <Switch value={notificationsPush} onValueChange={setNotificationsPush} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Email</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Résumés hebdomadaires</TexteTheme>
          </View>
          <Switch value={notificationsEmail} onValueChange={setNotificationsEmail} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>WhatsApp</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Messages sur les alertes VIP</TexteTheme>
          </View>
          <Switch value={notificationsWhatsapp} onValueChange={setNotificationsWhatsapp} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="palette-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Apparence</TexteTheme>
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <TexteTheme>Mode sombre</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Forcer l’interface sombre</TexteTheme>
          </View>
          <Switch value={modeSombre} onValueChange={setModeSombre} />
        </View>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="format-font" size={18} color={tint} />
            <TexteTheme>Police & taille du texte</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="help-circle-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Support & aide</TexteTheme>
        </View>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="message-text-outline" size={18} color={tint} />
            <TexteTheme>Contacter le support</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable style={[styles.rowButton, { borderColor: border, backgroundColor: backgroundSecondary }]}>
          <View style={styles.rowContent}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={tint} />
            <TexteTheme>Conditions & confidentialité</TexteTheme>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="logout" size={20} color={success} />
          <TexteTheme type="defaultSemiBold">Session</TexteTheme>
        </View>
        <Pressable style={[styles.logoutButton, { borderColor: border }]}>
          <TexteTheme style={{ color: success }}>Se déconnecter</TexteTheme>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  header: {
    gap: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleText: {
    flex: 1,
    gap: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
