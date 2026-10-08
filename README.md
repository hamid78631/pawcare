# PawCare · Pawly 🐾 — chatbot spécialisé en pet sitting

> **TP « Développement d'un chatbot spécialisé »** — Module *Applications avancées en IA* (Pr. H. Ayad), Mundiapolis, 3ᵉ année cycle ingénieur.
> **Binôme :** _à compléter_

**Pawly** est l'assistant de **PawCare**, une plateforme qui met en relation des propriétaires d'animaux et des pet-sitters. Il aide :

- les **propriétaires** à préparer la garde de leur animal (affaires, consignes, choix du sitter, stress de l'animal) ;
- les **pet-sitters débutants** à bien s'occuper d'un animal confié (alimentation, promenades, sécurité).

Il tient compte de la conversation, demande des précisions quand la question est ambiguë, refuse le hors-sujet et ne pose **jamais** de diagnostic vétérinaire.

---

## Sommaire

1. [Architecture](#1-architecture)
2. [Structure du dépôt](#2-structure-du-dépôt)
3. [Prérequis](#3-prérequis)
4. [Installation](#4-installation)
5. [Configuration](#5-configuration)
6. [Lancement](#6-lancement)
7. [API du chatbot](#7-api-du-chatbot)
8. [Phase 1 : le notebook](#8-phase-1--le-notebook)
9. [Vérifications de bout en bout](#9-vérifications-de-bout-en-bout)
10. [Limites du chatbot](#10-limites-du-chatbot)
11. [Le reste de PawCare (optionnel)](#11-le-reste-de-pawcare-optionnel)

---

## 1. Architecture

```
┌──────────────────────────┐
│ Navigateur — React       │  http://localhost:5173   (frontend/)
│ ChatbotWidget            │
└────────────┬─────────────┘
             │ HTTP JSON (CORS)
             ▼
┌──────────────────────────┐
│ API FastAPI — Python     │  http://localhost:8000   (chatbot-api/)
│ /health  /chat           │  historique en mémoire, un par conversation
└────────────┬─────────────┘
             │ HTTPS — API compatible OpenAI
             ▼
┌──────────────────────────┐
│ Groq — openai/gpt-oss-20b│
└──────────────────────────┘
```

| Couche | Technologies |
|---|---|
| Prototype (Phase 1) | Jupyter Notebook, `openai`, `python-dotenv` |
| Backend du chatbot (Phase 2) | Python 3.12, **FastAPI**, **Pydantic**, Uvicorn, client `openai`, géré avec **uv** |
| Frontend (Phase 2) | **React** 19, TypeScript, Vite, axios, react-markdown |
| Modèle de langage | **Groq**, modèle `openai/gpt-oss-20b` |

> Le reste de PawCare (comptes, sitters, réservations) repose sur un backend NestJS + PostgreSQL, **indépendant du chatbot** : Pawly fonctionne sans lui.

---

## 2. Structure du dépôt

```
PawCare/
├── chatbot-api/                 ← backend FastAPI du chatbot (Phase 2) + notebook (Phase 1)
│   ├── phase1_pawly.ipynb       ← notebook de la Phase 1 (présentation, tests, 2 versions du prompt)
│   ├── main.py                  ← application FastAPI : routes, CORS, gestion des erreurs
│   ├── schemas.py               ← modèles Pydantic (validation des requêtes)
│   ├── llm.py                   ← client Groq + fonction repondre()
│   ├── prompt.py                ← prompt système (identité et règles de Pawly)
│   ├── cli.py                   ← prototype : discussion dans le terminal
│   ├── .env.example             ← modèle de configuration (sans secret)
│   ├── pyproject.toml / uv.lock ← dépendances Python
│   └── .gitignore
├── frontend/                    ← application React
│   └── src/
│       ├── api/chatbotService.ts       ← appels à l'API du chatbot + messages d'erreur
│       └── components/ChatbotWidget.*  ← interface du chatbot
├── backend/                     ← API NestJS de PawCare (hors périmètre du TP)
├── docs/                        ← guide détaillé du projet (Markdown + PDF)
└── docker-compose.yml           ← déploiement de PawCare (hors chatbot)
```

---

## 3. Prérequis

| Outil | Version | Installation |
|---|---|---|
| **uv** | récente | Windows : `irm https://astral.sh/uv/install.ps1 \| iex` · macOS/Linux : `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| **Python** | 3.12 | installé automatiquement par uv si absent |
| **Node.js** | 20.19 ou plus (testé avec 24) | https://nodejs.org |
| **Clé API Groq** | gratuite | https://console.groq.com/keys |

---

## 4. Installation

```bash
git clone https://github.com/hamid78631/pawcare.git
cd pawcare
```

**Backend du chatbot :**
```bash
cd chatbot-api
uv sync
```
`uv sync` crée l'environnement virtuel `.venv` et installe les versions exactes de `uv.lock` (FastAPI, Uvicorn, openai, python-dotenv, et ipykernel pour le notebook).

**Frontend :**
```bash
cd ../frontend
npm install
```

---

## 5. Configuration

Le backend lit sa configuration dans `chatbot-api/.env`. On le crée à partir du modèle :

```bash
cd chatbot-api
cp .env.example .env            # Windows PowerShell : Copy-Item .env.example .env
```

Puis on renseigne la clé Groq dans `.env` :

| Variable | Obligatoire | Valeur par défaut | Rôle |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ | — | Clé API Groq (`gsk_...`) |
| `BASE_URL_GROQ` | ✅ | `https://api.groq.com/openai/v1` | Adresse de l'API compatible OpenAI |
| `GROQ_MODEL` | | `openai/gpt-oss-20b` | Modèle utilisé |
| `CORS_ORIGINS` | | `http://localhost:5173` | Origines autorisées (séparées par des virgules) |

**Frontend (optionnel) :** l'adresse de l'API est `http://localhost:8000` par défaut. Pour la changer, créer `frontend/.env` avec :
```
VITE_CHATBOT_API_URL=http://localhost:8000
```

> 🔒 Le fichier `.env` est ignoré par Git. **Ne jamais versionner une vraie clé.** Si une clé a été exposée, la révoquer sur la console Groq.

---

## 6. Lancement

Deux terminaux :

**Terminal 1 — API du chatbot** (dans `chatbot-api/`) :
```bash
uv run uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend** (dans `frontend/`) :
```bash
npm run dev
```

| Adresse | Contenu |
|---|---|
| http://localhost:5173 | Application — cliquer sur la bulle verte en bas à droite |
| http://localhost:8000/health | Vérification du service |
| http://localhost:8000/docs | Documentation interactive Swagger (tester l'API à la main) |

**Prototype en terminal** (sans interface web) :
```bash
cd chatbot-api
uv run cli.py          # 'reset' pour réinitialiser, 'quit' pour quitter
```

---

## 7. API du chatbot

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/health` | Vérifier que le service fonctionne → `{"status": "ok"}` |
| `POST` | `/chat` | Envoyer un message et recevoir la réponse |
| `DELETE` | `/chat/{conversation_id}` | Réinitialiser une conversation |

### `POST /chat`

Premier message (sans identifiant → le serveur crée une conversation) :
```json
{ "message": "Je pars une semaine, comment préparer mon chien ?" }
```
Réponse :
```json
{ "conversation_id": "3f2a9c1e-7b4d-4e8a-9f12-ab34cd56ef78", "reply": "Pour préparer ton chien..." }
```
Messages suivants : renvoyer le même `conversation_id` pour conserver l'historique.
```json
{ "message": "Et s'il aboie la nuit ?", "conversation_id": "3f2a9c1e-7b4d-4e8a-9f12-ab34cd56ef78" }
```

### Fonctionnement
- **Historique par conversation** : un dictionnaire en mémoire `{conversation_id: [messages]}` ; à chaque appel, le modèle reçoit *prompt système + historique + nouveau message* (un LLM n'a pas de mémoire propre). Les données sont perdues au redémarrage du serveur.
- **Validation (Pydantic)** : `message` de 1 à 2000 caractères, espaces retirés aux extrémités → un message vide ou composé d'espaces est refusé.
- **Délai** : 30 s maximum par appel au modèle, sans nouvelle tentative automatique.

### Codes d'erreur

| Code | Cas |
|---|---|
| `422` | Message vide, absent ou trop long (validation Pydantic) |
| `502` | Le fournisseur du modèle a renvoyé une erreur (clé invalide, modèle inexistant, quota…) |
| `503` | Le fournisseur du modèle est injoignable |
| `504` | Le modèle n'a pas répondu dans le délai de 30 s |

Les erreurs ont la forme `{"detail": "message lisible"}`, affiché tel quel par l'interface.

---

## 8. Phase 1 : le notebook

`chatbot-api/phase1_pawly.ipynb` contient :

- la **présentation** du chatbot (nom, domaine, public, besoins, exemples, limites) ;
- la **connexion** au modèle (clé lue depuis `.env`, jamais affichée) ;
- le **prompt système** (version 1) ;
- la fonction `repondre(message, historique)`, une démonstration mémoire / réinitialisation et la **boucle de conversation** ;
- **10 tests** (4 dans le domaine, 2 avec contexte, 1 ambigu, 1 hors domaine, 1 sensible, 1 tentative de manipulation) avec tableau d'évaluation ;
- un **prompt version 2** comparé sur les mêmes tests (v1 : 7 ✅ · 2 ⚠️ · 1 ❌ → v2 : 9 ✅ · 1 ⚠️ · 0 ❌) et une analyse.

**Ouvrir le notebook :** dans Cursor ou VS Code, ouvrir `chatbot-api/phase1_pawly.ipynb` et choisir le kernel **`.venv` (chatbot-api)**.

> ℹ️ Le notebook est livré **avec ses résultats d'exécution**. Les appréciations correspondent à ces résultats : le modèle n'étant pas déterministe, une nouvelle exécution peut produire des réponses différentes.

---

## 9. Vérifications de bout en bout

| Vérification | Comportement attendu |
|---|---|
| Conversation normale | Indicateur « • • • » puis réponse mise en forme (Markdown) |
| Question de suite (« Et s'il… ») | Le contexte est conservé |
| Message vide | Bouton d'envoi désactivé côté interface ; `422` côté API |
| Bouton ↺ « Nouvelle conversation » | `DELETE /chat/{id}`, l'historique est oublié |
| Deux conversations en parallèle (deux fenêtres) | Historiques isolés |
| API arrêtée | Message « Pawly est injoignable pour le moment… » |
| Modèle indisponible / trop lent | Message d'erreur lisible (`502`, `503`, `504`) |
| Bouton ⓘ | Affichage des limites d'utilisation |
| Smartphone (≤ 480 px) | Chat en plein écran |

---

## 10. Limites du chatbot

- ❌ **Aucun diagnostic vétérinaire**, aucun médicament ni posologie : il oriente vers un vétérinaire.
- 🚨 En cas d'**urgence** (intoxication, saignement, difficulté à respirer…), il renvoie immédiatement vers un vétérinaire.
- ❌ Il **n'a pas accès** aux données réelles de PawCare (sitters, tarifs, réservations).
- ❌ Il refuse les questions **hors sujet** et les tentatives de lui faire **ignorer ses consignes**.
- ⚠️ Il peut **se tromper** ou produire des informations inexactes : vérifier les informations importantes.
- 🔒 Ne pas lui transmettre de **données personnelles sensibles** ; les essais du TP utilisent des situations fictives.
- 💾 Les conversations sont stockées **en mémoire** et perdues au redémarrage de l'API.
- ⏳ L'offre gratuite de Groq limite le nombre de requêtes par minute (erreur `429`).

---

## 11. Le reste de PawCare (optionnel)

Le chatbot n'en a pas besoin, mais pour utiliser toute la plateforme (inscription, recherche de sitters, réservations), il faut aussi lancer le backend **NestJS** avec **PostgreSQL** :

- en local : `cd backend`, `npm install`, configurer `backend/.env` (base de données, JWT), puis `npm run start:dev` (port 3000) ;
- ou avec Docker : copier `.env.example` (à la racine) en `.env`, puis `docker compose up --build`.

> Le `docker-compose.yml` ne contient pas encore le service du chatbot : l'API FastAPI se lance séparément (section 6).
