# Guide d'Installation

## Prérequis

- Node.js
- MySQL
- npm

## Installation du Backend

1. Naviguez vers le dossier backend et installez les dépendances :

```bash
cd backend
npm install
```

## Configuration de la Base de Données

1. Assurez-vous que MySQL est installé et en cours d'exécution sur votre machine.

2. Exécutez le script SQL pour créer la structure de la base de données :

```bash
mysql -u votre_utilisateur -p < Erreur_de_parcours/backend/src/database/schema.sql
```

## Configuration des Variables d'Environnement

1. Dupliquez le fichier `.env.example` et renommez-le en `.env` :

```bash
cp .env.example .env
```

2. Modifiez le fichier `.env` avec vos propres valeurs :
   - `JWT_SECRET` : Votre clé secrète pour les tokens JWT
   - `DB_PASSWORD` : Le mot de passe de votre base de données MySQL

## Test de l'API

Une collection Bruno est disponible pour tester l'API. Vous la trouverez dans le dossier :

```
backend/api-collection
```

Pour l'utiliser :
1. Installez Bruno (https://www.usebruno.com/)
2. Ouvrez la collection située dans `backend/api-collection`
3. Testez les différents endpoints de l'API

## Démarrage

Une fois l'installation et la configuration terminées, vous pouvez démarrer le serveur backend :

```bash
npm start
```