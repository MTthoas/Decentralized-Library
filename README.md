# Decentralized Library

Decentralized Library est un projet visant à créer une bibliothèque numérique décentralisée, permettant aux utilisateurs de partager et d'accéder à des ressources sans dépendre d'une autorité centrale

## Prerequisites

- Node.js
- npm
- Metamask

## Installation

Clone this repository on your local machine.
Navigate to the project folder.

```bash 
git clone https://github.com/MTthoas/Decentralized-Library.git
```

## Configure .env

1 - Dupliquez le fichier .env.example et renommez-le en .env.

2 - Renseignez les clés nécessaires :

-   PRIVATE_KEY: La clé privée du futur libraire.
-   ALCHEMY_SEPOLIA_API_KEY: Une clé Alchemy pour le réseau Sepolia. Cette clé est nécessaire car Sepolia est une version test du réseau Ethereum, et Alchemy offre une API pour interagir avec ce réseau.

```bash
PRIVATE_KEY=""
ALCHEMY_SEPOLIA_API_KEY=""
```

3 - Assurez-vous d'avoir des fonds sur votre compte de libraire en utilisant le faucet : https://sepoliafaucet.com/

4 - Dans le dossier du projet racine, exécutez :
```bash
npm install
```

5 - Déployez le smart contract sur Sepolia :

```bash
npx hardhat run scripts/deploy.js --network sepolia
 ```

Note : Des livres seront automatiquement créés lors de cette étape.    

6 - Naviguez vers le dossier ./client et installez les dépendances :
```bash
npm install
```

7 - Construisez le projet client :
```bash
npm run build
```

8 - npm run preview
```bash
npm run preview
```

## Explication

Le libraire peut enregistrer de nouveaux livres

La personne tiers peut demander un prêt de livre

Uniquement le libraire peut accorder le prêt

La personne tiers peut rendre le livre
Ce livre retourne au libraire

Le libraire peut supprimer un livre de la collection



















