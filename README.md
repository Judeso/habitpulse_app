# 🌱 HabitPulse v3.0 — PWA Production-Ready

> Application de suivi d'habitudes complète : freemium, pub intégrée, classement amis, IA.

![Version](https://img.shields.io/badge/version-3.0.0-brightgreen?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-ready-blue?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

---

## 🚀 Démarrage immédiat

```bash
git clone https://github.com/TON_USERNAME/habitpulse.git
cd habitpulse

# Option 1 : ouvrir directement
open index.html

# Option 2 : serveur local (recommandé pour PWA + SW)
npx serve .
# ou
python3 -m http.server 3000
```

---

## 📦 Fichiers du projet

| Fichier | Rôle |
|---------|------|
| `index.html` | Application complète (PWA, UI, logique) |
| `manifest.json` | Manifest PWA (installabilité, icônes, raccourcis) |
| `sw.js` | Service Worker (offline, push notifs, background sync) |
| `ARCHITECTURE.md` | Guide complet du stack production (React Native, Supabase, etc.) |

---

## ✨ Fonctionnalités complètes

### 🏠 Aujourd'hui
- Onboarding prénom + pseudo + 3 habitudes
- Citation motivante du jour (14 citations rotatives)
- Anneau de progression animé
- Bande de dates 7 jours avec indicateurs
- Toggle jour de repos (préserve la streak)
- **Rewarded Ad** : "Regarder une pub = +50 pts" (cooldown 3h)
- Bannière pub AdSense (emplacement prêt)

### 🧠 Quiz Santé
- 5 questions sur sommeil, énergie, stress, alimentation, bien-être global
- Score personnalisé avec conseils
- +20 à +35 points selon le score
- Bannière pub après résultat

### 👥 Amis & Classement
- Profil avec code unique à 6 caractères
- Ajout d'amis par code
- Classement hebdomadaire temps réel
- Sync via stockage partagé (Claude artifact) → Supabase en production

### 📊 Stats
- 4 KPIs clés (complétion, série, points, niveau)
- Graphique en barres 7 jours
- Calendrier mensuel navigable (parfait / partiel / repos / raté)
- Analyse IA (Claude) personnalisée
- Partage réseaux sociaux (Facebook, Instagram, Snapchat, WhatsApp, natif)
- Génération de carte stats en Canvas haute résolution (1080×1080)

### 🏆 Gamification
- Système de points (habitudes, streaks, quiz, journée parfaite)
- 6 niveaux : 🌱 Graine → 🌿 → 🌳 → ⭐ → 🏆 → 💎 Légende
- Popup de level-up animée
- Confettis sur journée parfaite et level-up
- Points flottants animés

### ⚙️ Paramètres
- Rappel quotidien (heure personnalisée)
- Alerte streak en danger
- Infos compte / code ami
- Réinitialisation sécurisée

### 📲 PWA
- Installable sur Android, iOS, Desktop
- Service Worker : cache offline complet
- Notifications push natives
- Background sync quotidien
- Raccourcis d'app (Aujourd'hui, Quiz)

---

## 💰 Intégrer la monétisation

### Google AdSense (Web/PWA)
1. Crée un compte sur [adsense.google.com](https://adsense.google.com)
2. Soumets ton site (domain doit être en ligne)
3. Attends l'approbation (24-72h)
4. Dans `index.html`, remplace les blocs `ad-placeholder` par ton code AdSense :

```html
<!-- En haut de <head> -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>

<!-- Dans les div.ad-banner -->
<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### Déploiement rapide (requis pour AdSense)
```bash
# Vercel (recommandé)
npx vercel

# Netlify
# Drag & drop du dossier sur app.netlify.com

# GitHub Pages
# Settings → Pages → Source: main branch
```

---

## 🛣️ Prochaines étapes (voir ARCHITECTURE.md)

1. **Backend** : Connecter Supabase (remplacer localStorage + stockage partagé)
2. **Auth** : Login email / Google / Apple
3. **App Mobile** : Migrer vers React Native + Expo
4. **AdMob** : Pub native Android/iOS (banner + interstitiel + rewarded)
5. **RevenueCat** : Abonnements in-app (Apple IAP + Google Play)
6. **OneSignal** : Notifications push avancées

---

## 📄 Licence

MIT — libre d'utilisation, modification et distribution.
