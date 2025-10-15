#!/bin/bash

# Zaplink SDK - Script de Publication NPM
# Ce script publie les packages sur npmjs.org

set -e  # Arrêter en cas d'erreur

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "📦 Zaplink SDK - Publication NPM"
echo "================================"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "pnpm-workspace.yaml" ]; then
    log_error "Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Vérifier que l'utilisateur est connecté à npm
log_info "Vérification de la connexion NPM..."
if ! npm whoami &> /dev/null; then
    log_error "Vous n'êtes pas connecté à NPM"
    log_info "Exécutez: npm login"
    exit 1
fi

NPM_USER=$(npm whoami)
log_success "Connecté en tant que: $NPM_USER"
echo ""

# Demander confirmation
log_warning "Vous êtes sur le point de publier sur NPM en tant que: $NPM_USER"
read -p "Voulez-vous continuer? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Publication annulée"
    exit 0
fi
echo ""

# Nettoyer et reconstruire
log_info "Nettoyage et reconstruction..."
pnpm clean || rm -rf packages/*/dist
pnpm install
pnpm build

if [ $? -ne 0 ]; then
    log_error "Échec du build"
    exit 1
fi
log_success "Build terminé"
echo ""

# Vérifier les versions
log_info "Versions à publier:"
echo ""
CORE_VERSION=$(node -p "require('./packages/core/package.json').version")
REACT_VERSION=$(node -p "require('./packages/react/package.json').version")
echo "  📦 @zaplink/core@$CORE_VERSION"
echo "  📦 @zaplink/react@$REACT_VERSION"
echo ""

read -p "Ces versions sont-elles correctes? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Publication annulée"
    log_info "Mettez à jour les versions dans package.json puis réessayez"
    exit 0
fi
echo ""

# Publier @zaplink/core
log_info "Publication de @zaplink/core..."
cd packages/core

# Dry run pour vérifier
log_info "Test de publication (dry-run)..."
npm publish --dry-run --access public

if [ $? -ne 0 ]; then
    log_error "Échec du dry-run pour @zaplink/core"
    exit 1
fi

# Publication réelle
log_info "Publication réelle..."
npm publish --access public

if [ $? -eq 0 ]; then
    log_success "@zaplink/core@$CORE_VERSION publié!"
else
    log_error "Échec de la publication de @zaplink/core"
    exit 1
fi

cd ../..
echo ""

# Publier @zaplink/react
log_info "Publication de @zaplink/react..."
cd packages/react

# Dry run pour vérifier
log_info "Test de publication (dry-run)..."
npm publish --dry-run --access public

if [ $? -ne 0 ]; then
    log_error "Échec du dry-run pour @zaplink/react"
    exit 1
fi

# Publication réelle
log_info "Publication réelle..."
npm publish --access public

if [ $? -eq 0 ]; then
    log_success "@zaplink/react@$REACT_VERSION publié!"
else
    log_error "Échec de la publication de @zaplink/react"
    exit 1
fi

cd ../..
echo ""

# Succès!
echo "================================"
log_success "🎉 Publication terminée avec succès!"
echo "================================"
echo ""
echo "📦 Packages publiés:"
echo "  - @zaplink/core@$CORE_VERSION"
echo "  - @zaplink/react@$REACT_VERSION"
echo ""
echo "🔗 Liens NPM:"
echo "  - https://www.npmjs.com/package/@zaplink/core"
echo "  - https://www.npmjs.com/package/@zaplink/react"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Créer un tag Git: git tag v$CORE_VERSION"
echo "  2. Push le tag: git push origin v$CORE_VERSION"
echo "  3. Créer une release sur GitHub"
echo "  4. Annoncer la release à la communauté"
echo ""
