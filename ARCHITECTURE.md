# 🏗️ HabitPulse — Architecture Complète & Stack Technologique

> Guide de référence complet pour transformer le prototype HTML en application mobile production, pérenne et monétisée.

---

## 📐 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                   HABITPULSE ECOSYSTEM                   │
├──────────────┬──────────────────┬───────────────────────┤
│   MOBILE APP │    WEB / PWA     │       BACKEND         │
│ React Native │  PWA (ce repo)   │      Supabase         │
│   + Expo     │  Google AdSense  │  PostgreSQL + Auth    │
│   + AdMob    │  Stripe Web      │  Realtime + Storage   │
├──────────────┴──────────────────┴───────────────────────┤
│                    SERVICES TIERS                        │
│  RevenueCat · OneSignal · Sentry · PostHog · Resend     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Décision Stratégique : Stack Recommandé

### Pourquoi React Native + Expo ?

| Critère            | React Native+Expo | Flutter | Capacitor/PWA |
|--------------------|:-----------------:|:-------:|:-------------:|
| Accès AdMob natif  | ✅                 | ✅       | ❌ (AdSense seulement) |
| Courbe d'apprentissage | Moyenne       | Haute   | Basse          |
| Perf. native       | ✅ Excellente      | ✅       | Correcte       |
| Écosystème 2025    | ✅ Très riche      | ✅       | Limité         |
| Publication stores | ✅ EAS Build       | ✅       | TWA (Play seul)|
| Web + Mobile       | ✅ Expo Router     | Partiel  | ✅             |
| Monétisation IAP   | ✅ RevenueCat      | ✅       | ⚠️ Stripe seulement |

**Verdict : React Native + Expo est le meilleur choix pour une app pérenne.**

---

## 🛠️ Stack Complet — Couche par Couche

### 1. Frontend Mobile
```
React Native 0.76+
  └── Expo SDK 52 (managed workflow)
  └── Expo Router 4 (navigation file-based)
  └── NativeWind 4 (TailwindCSS pour RN)
  └── React Query (état serveur + cache)
  └── Zustand (état local)
  └── React Hook Form + Zod (formulaires)
```

### 2. Backend — Supabase (Open Source Firebase)
```
Supabase (PostgreSQL 15)
  ├── Auth        → Email, Google, Apple, Facebook SSO
  ├── Database    → PostgreSQL + Row Level Security
  ├── Realtime    → Classement amis en temps réel
  ├── Storage     → Photos de profil
  ├── Edge Fns    → Webhooks RevenueCat, IA Anthropic
  └── Cron Jobs   → Calcul streaks, envoi notifs
```

**Schéma de base de données :**
```sql
-- Utilisateurs
CREATE TABLE profiles (
  id          uuid REFERENCES auth.users PRIMARY KEY,
  username    text UNIQUE NOT NULL,
  display_name text,
  avatar_url  text,
  points      int DEFAULT 0,
  week_points int DEFAULT 0,
  level       text DEFAULT 'Graine',
  streak      int DEFAULT 0,
  is_premium  bool DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Habitudes
CREATE TABLE habits (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  name        text NOT NULL,
  emoji       text,
  color       text,
  order_idx   int,
  is_active   bool DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- Logs quotidiens
CREATE TABLE habit_logs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  habit_id    uuid REFERENCES habits(id),
  logged_date date NOT NULL,
  is_rest_day bool DEFAULT false,
  notes       text,
  UNIQUE(habit_id, logged_date)
);

-- Résultats quiz
CREATE TABLE quiz_results (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  score       int NOT NULL,
  answers     jsonb,
  points_earned int,
  quiz_date   date DEFAULT CURRENT_DATE
);

-- Amis
CREATE TABLE friendships (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  friend_id   uuid REFERENCES profiles(id),
  status      text DEFAULT 'accepted',
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Transactions de points
CREATE TABLE point_transactions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id),
  amount      int NOT NULL,
  reason      text, -- 'habit_check', 'perfect_day', 'quiz', 'streak_bonus', 'rewarded_ad'
  created_at  timestamptz DEFAULT now()
);
```

### 3. Authentification
```
Supabase Auth
  ├── Email + Password
  ├── Magic Link (email passwordless)
  ├── Google OAuth (Android/iOS + Web)
  ├── Apple Sign In (obligatoire iOS)
  └── Deep links pour mobile (expo-linking)
```

### 4. Monétisation — Stratégie Complète

#### A. Publicités (version gratuite)
```
Mobile (Android + iOS) → Google AdMob
  ├── Banner Ads       → En bas de l'écran, 320x50
  ├── Interstitial     → Après complétion journalière
  └── Rewarded Ads     → "Regarder une pub = +50 pts"
                          ou "Débloquer 1 habitude 24h"

Web / PWA → Google AdSense
  ├── Display Ad       → Bannière responsive
  └── In-feed Ad       → Entre les habitudes

Revenus estimés AdMob :
  ├── Banner : 0.10 – 0.50€ CPM
  ├── Interstitiel : 1 – 5€ CPM
  └── Rewarded : 5 – 15€ CPM ← Meilleur ROI
```

#### B. Abonnements Premium (RevenueCat)
```
RevenueCat
  ├── iOS  → App Store (Apple IAP)
  ├── Android → Google Play Billing
  └── Web  → Stripe Checkout

Plans :
  ├── Monthly   → 3.99€/mois
  ├── Yearly    → 24.99€/an (−48%)
  └── Lifetime  → 59.99€ (one-time)

RevenueCat gère automatiquement :
  ├── Trials gratuits 7 jours
  ├── Renouvellements
  ├── Remboursements
  ├── Webhooks vers Supabase
  └── Dashboard analytics revenus
```

#### C. Modèle Freemium détaillé
```
GRATUIT                  PREMIUM
─────────────────────    ─────────────────────
3 habitudes max          Illimité
Stats 7 jours            Stats 30+ jours
Quiz 1x/jour             Quiz illimité
Analyse IA 1x/semaine    Analyse IA illimitée
Pubs affichées           Sans publicité
Export impossible        Export PDF/CSV
Streaks basiques         Streak recovery (1/mois)
Classement limité        Classement étendu
```

### 5. Notifications Push
```
Expo Push Notifications (gratuit jusqu'à 1M/mois)
  + OneSignal (segmentation avancée)

Scénarios :
  ├── Rappel quotidien       → "🌱 N'oublie pas tes habitudes !"
  ├── Streak en danger       → "🔥 Tu es à J-1 de perdre ta série !"
  ├── Ami te dépasse         → "Marie vient de te dépasser ! +12pts"
  ├── Badge débloqué         → "🏆 Nouveau niveau : Étoile !"
  └── Résumé hebdomadaire    → "Ta semaine en résumé 📊"
```

### 6. Analytics
```
PostHog (open source, self-hostable)
  ├── Events custom         → habit_checked, quiz_completed
  ├── Funnels               → Onboarding → Premium conversion
  ├── Retention             → Cohortes hebdomadaires
  └── Feature flags         → A/B test paywalls

Expo Analytics → Crash reports
```

### 7. Suivi des erreurs
```
Sentry (free tier)
  ├── Crash reporting
  ├── Performance monitoring
  └── Session replay (web)
```

---

## 📁 Structure du Projet React Native

```
habitpulse/
├── app/                          # Expo Router (navigation)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── index.tsx             # Today
│   │   ├── quiz.tsx
│   │   ├── friends.tsx
│   │   └── stats.tsx
│   └── _layout.tsx
│
├── components/
│   ├── ads/
│   │   ├── BannerAd.tsx          # AdMob Banner
│   │   ├── RewardedAdButton.tsx  # "Regarder une pub"
│   │   └── InterstitialAd.tsx
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   └── HabitList.tsx
│   ├── quiz/
│   │   └── QuizCard.tsx
│   └── ui/
│       ├── ProgressRing.tsx
│       ├── ShareCanvas.tsx
│       └── PremiumModal.tsx
│
├── lib/
│   ├── supabase.ts               # Client Supabase
│   ├── revenuecat.ts             # Client RevenueCat
│   ├── admob.ts                  # Config AdMob
│   ├── notifications.ts          # Push notifs
│   └── analytics.ts              # PostHog
│
├── hooks/
│   ├── useHabits.ts
│   ├── useAuth.ts
│   ├── useSubscription.ts
│   └── useLeaderboard.ts
│
├── stores/
│   └── appStore.ts               # Zustand
│
├── supabase/
│   ├── migrations/               # SQL migrations
│   └── functions/
│       ├── weekly-reset/         # Cron: reset points semaine
│       ├── ai-analysis/          # Claude API
│       └── revenuecat-webhook/   # Webhooks paiements
│
├── app.json                      # Config Expo
├── eas.json                      # Config EAS Build
└── package.json
```

---

## 🚀 Roadmap de Déploiement

### Phase 1 — MVP Web (0 – 2 semaines)
```
✅ PWA HTML actuelle (ce repo)
□ Déploiement Vercel/Netlify
□ Domaine personnalisé
□ Google AdSense (approbation 24-48h)
□ Supabase projet créé
□ Analytics PostHog
```

### Phase 2 — Backend (2 – 4 semaines)
```
□ Migrations Supabase
□ Auth email + Google
□ Sync données cloud (fin du localStorage)
□ API amis temps réel
□ Edge Function IA (Claude)
```

### Phase 3 — App Mobile (4 – 10 semaines)
```
□ Setup Expo + React Native
□ Migration UI vers NativeWind
□ AdMob intégration
□ RevenueCat + paywalls
□ Push notifications OneSignal
□ EAS Build (cloud build)
```

### Phase 4 — Publication (semaine 10-12)
```
□ Google Play Store (25$ unique)
□ Apple App Store (99$/an)
□ ASO (App Store Optimization)
□ Campagne de lancement
```

### Phase 5 — Croissance (en continu)
```
□ A/B testing paywalls (RevenueCat Experiments)
□ Localisation (EN, ES, DE, PT)
□ Widget iOS/Android
□ Apple Watch / Wear OS
□ Challenges en groupe
□ Intégration Apple Health / Google Fit
```

---

## 💰 Projections Financières

### Scénario réaliste (12 mois)
```
Mois 1-3  :    500 utilisateurs actifs
  → AdMob Rewarded  : ~30€/mois
  → Abonnements     :  ~5 × 3.99€ = ~20€/mois
  Total             : ~50€/mois

Mois 4-6  :  2,000 utilisateurs actifs
  → AdMob           : ~150€/mois
  → Abonnements     : ~30 × 3.99€ = ~120€/mois
  Total             : ~270€/mois

Mois 7-12 : 10,000 utilisateurs actifs
  → AdMob           : ~600€/mois
  → Abonnements     : ~200 × 3.99€ = ~800€/mois
  Total             : ~1,400€/mois

Conversion gratuit → premium : objectif 2-5%
```

---

## 🔑 Clés API à Obtenir

| Service | URL | Prix | Usage |
|---------|-----|------|-------|
| Supabase | supabase.com | Gratuit jusqu'à 500MB | Backend |
| RevenueCat | revenuecat.com | Gratuit < 2500$/mois revenus | IAP |
| Google AdMob | admob.google.com | Gratuit (revenus 70%) | Pub mobile |
| Google AdSense | adsense.google.com | Gratuit (revenus 68%) | Pub web |
| Anthropic API | anthropic.com | ~$0.003/1K tokens | IA |
| OneSignal | onesignal.com | Gratuit < 1M notifs/mois | Push |
| Sentry | sentry.io | Gratuit < 5K erreurs/mois | Monitoring |
| PostHog | posthog.com | Gratuit < 1M events/mois | Analytics |
| Expo EAS | expo.dev | Gratuit 30 builds/mois | CI/CD |

**Coût mensuel total au démarrage : ~0€**

---

## ⚡ Commandes de démarrage

```bash
# Créer le projet Expo
npx create-expo-app@latest habitpulse --template tabs
cd habitpulse

# Installer les dépendances clés
npx expo install expo-router expo-notifications expo-ads-admob
npm install @supabase/supabase-js @supabase/react-native-async-storage
npm install react-native-purchases  # RevenueCat
npm install posthog-react-native @sentry/react-native
npm install nativewind zustand @tanstack/react-query
npm install react-hook-form zod

# Démarrer le développement
npx expo start

# Build production
npx eas build --platform android --profile production
npx eas submit --platform android  # Soumettre au Play Store
```

---

## 📊 Architecture Pub (AdMob) dans React Native

```tsx
// components/ads/BannerAd.tsx
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-XXXXXXXX/XXXXXXXX'; // Ton vrai ID AdMob

export function HabitBanner() {
  return (
    <BannerAd
      unitId={BANNER_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: false }}
    />
  );
}

// components/ads/RewardedAdButton.tsx
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const REWARDED_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-XXXXXXXX/XXXXXXXX';

export function WatchAdForPoints({ onReward }) {
  const rewarded = RewardedAd.createForAdRequest(REWARDED_ID);

  const showAd = () => {
    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      onReward(50); // +50 points
    });
    rewarded.load();
    rewarded.show();
  };

  return (
    <TouchableOpacity onPress={showAd}>
      <Text>📺 Regarder une pub → +50 pts</Text>
    </TouchableOpacity>
  );
}
```

---

## 🔒 Sécurité & RGPD

```
□ Politique de confidentialité obligatoire (Play Store + App Store)
□ Consentement cookies / pub (CMP - Consent Management Platform)
□ Chiffrement données en transit (HTTPS/TLS)
□ Row Level Security Supabase (chaque user voit ses données)
□ Données anonymisées pour analytics
□ Bouton "Supprimer mon compte" (obligation stores)
□ Pas de vente de données (RGPD Art.6)
□ Hébergement EU possible avec Supabase (Frankfurt)
```

---

*Document maintenu par l'équipe HabitPulse. Dernière mise à jour : 2025.*
