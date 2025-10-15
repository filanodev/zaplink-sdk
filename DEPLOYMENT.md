# 🚀 Guide de Déploiement Zaplink SDK

Ce guide explique comment déployer le SDK sur NPM et GitHub.

## 📋 Pré-requis

- [x] Compte NPM créé
- [x] Compte GitHub configuré
- [x] Node.js >= 18.0.0
- [x] pnpm >= 8.0.0
- [x] Git configuré

## 🔑 Configuration NPM

### 1. Créer un compte NPM

Si vous n'avez pas encore de compte:
```bash
# Créer un compte sur https://www.npmjs.com/signup
```

### 2. Se connecter à NPM

```bash
npm login
```

Entrez vos identifiants:
- Username
- Password
- Email
- OTP (si 2FA activé)

### 3. Vérifier la connexion

```bash
npm whoami
# Devrait afficher votre username NPM
```

### 4. Créer un token NPM (pour GitHub Actions)

1. Allez sur https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Cliquez "Generate New Token"
3. Sélectionnez "Automation"
4. Copiez le token généré

### 5. Ajouter le token à GitHub Secrets

1. Allez sur https://github.com/filanodev/zaplink-sdk/settings/secrets/actions
2. Cliquez "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Collez votre token NPM
5. Cliquez "Add secret"

## 📦 Publication Manuelle sur NPM

### Option 1: Script automatique (RECOMMANDÉ)

```bash
cd /mnt/d/windsurf/pi/zaplink-sdk
./publish.sh
```

Ce script va:
1. ✅ Vérifier votre connexion NPM
2. ✅ Nettoyer et reconstruire les packages
3. ✅ Afficher les versions à publier
4. ✅ Faire un dry-run pour tester
5. ✅ Publier @zaplink/core
6. ✅ Publier @zaplink/react
7. ✅ Afficher les liens NPM

### Option 2: Publication manuelle

```bash
# 1. Build tous les packages
pnpm build

# 2. Publier @zaplink/core
cd packages/core
npm publish --access public

# 3. Publier @zaplink/react
cd ../react
npm publish --access public
```

## 🤖 Publication Automatique avec GitHub Actions

### Configuration

Les GitHub Actions sont déjà configurées dans `.github/workflows/`:

1. **`ci.yml`** - Tests et build automatiques
   - Se déclenche sur push et PR
   - Teste sur Node 18 et 20
   - Vérifie le build

2. **`publish.yml`** - Publication automatique sur NPM
   - Se déclenche lors de la création d'une release
   - Ou manuellement via workflow_dispatch

3. **`release.yml`** - Création de releases GitHub
   - Se déclenche sur les tags v*.*.*

### Publier via GitHub Actions

#### Méthode 1: Via Release (RECOMMANDÉ)

```bash
# 1. Mettre à jour la version
cd packages/core
npm version patch  # ou minor, ou major

cd ../react
npm version patch  # ou minor, ou major

# 2. Commit les changements
git add .
git commit -m "chore: bump version to 1.0.1"

# 3. Créer un tag
git tag v1.0.1

# 4. Push le tag
git push origin v1.0.1

# 5. Créer une release sur GitHub
# Allez sur https://github.com/filanodev/zaplink-sdk/releases/new
# Ou utilisez GitHub CLI:
gh release create v1.0.1 --title "Release v1.0.1" --notes "Bug fixes and improvements"
```

#### Méthode 2: Déclenchement manuel

1. Allez sur https://github.com/filanodev/zaplink-sdk/actions
2. Sélectionnez "Publish to NPM"
3. Cliquez "Run workflow"
4. Sélectionnez la branche `main`
5. Cliquez "Run workflow"

## 🔄 Workflow de Version

### Semantic Versioning

Suivez [semver](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Commandes de versioning

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.0 → 1.1.0)
npm version minor

# Major (1.0.0 → 2.0.0)
npm version major

# Version spécifique
npm version 1.2.3
```

## 📝 Checklist de Publication

### Avant publication

- [ ] Tous les tests passent (`pnpm test`)
- [ ] Le build fonctionne (`pnpm build`)
- [ ] La documentation est à jour
- [ ] Le CHANGELOG est mis à jour
- [ ] Les versions sont correctes
- [ ] Connecté à NPM (`npm whoami`)

### Publication

- [ ] Build réussi
- [ ] Dry-run réussi
- [ ] Publication @zaplink/core
- [ ] Publication @zaplink/react
- [ ] Vérification sur npmjs.com

### Après publication

- [ ] Créer tag Git
- [ ] Push le tag
- [ ] Créer GitHub release
- [ ] Tester l'installation: `npm install @zaplink/core`
- [ ] Annoncer la release

## 🐛 Dépannage

### Erreur: "You do not have permission to publish"

```bash
# Vérifier que vous êtes connecté
npm whoami

# Se reconnecter
npm logout
npm login
```

### Erreur: "Package name already exists"

Le nom `@zaplink/core` doit être disponible. Si ce n'est pas le cas:
1. Créez l'organisation `@zaplink` sur NPM
2. Ou changez le nom dans `package.json`

### Erreur: "Version already published"

```bash
# Incrémenter la version
npm version patch

# Puis republier
npm publish
```

### GitHub Actions échoue

1. Vérifiez que `NPM_TOKEN` est configuré dans les secrets
2. Vérifiez que le token a les bonnes permissions
3. Vérifiez les logs dans l'onglet Actions

## 📊 Monitoring

### Vérifier les packages publiés

- https://www.npmjs.com/package/@zaplink/core
- https://www.npmjs.com/package/@zaplink/react

### Statistiques de téléchargement

```bash
npm info @zaplink/core
npm info @zaplink/react
```

### Badges pour README

```markdown
[![npm version](https://badge.fury.io/js/%40zaplink%2Fcore.svg)](https://www.npmjs.com/package/@zaplink/core)
[![downloads](https://img.shields.io/npm/dm/@zaplink/core.svg)](https://www.npmjs.com/package/@zaplink/core)
```

## 🔐 Sécurité

### Rotation des tokens

Changez vos tokens NPM régulièrement:
1. Créez un nouveau token
2. Mettez à jour GitHub secrets
3. Révoquéz l'ancien token

### 2FA recommandé

Activez l'authentification à deux facteurs sur:
- Votre compte NPM
- Votre compte GitHub

## 📞 Support

En cas de problème:
- 📧 support@piketplace.com
- 🐛 https://github.com/filanodev/zaplink-sdk/issues
- 📚 https://docs.npmjs.com/

---

**Dernière mise à jour:** 15 Octobre 2025
