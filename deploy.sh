#!/bin/bash

# Zaplink SDK - Script de Déploiement
# Ce script prépare et vérifie le SDK avant déploiement

set -e  # Arrêter en cas d'erreur

echo "🚀 Zaplink SDK - Déploiement"
echo "=============================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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

# Vérifier qu'on est dans le bon dossier
if [ ! -f "pnpm-workspace.yaml" ]; then
    log_error "Erreur: Exécutez ce script depuis la racine du projet zaplink-sdk"
    exit 1
fi

log_success "Dossier du projet trouvé"
echo ""

# Étape 1: Vérification de pnpm
log_info "Étape 1/6: Vérification de pnpm..."
if ! command -v pnpm &> /dev/null; then
    log_error "pnpm n'est pas installé"
    log_info "Installez pnpm avec: npm install -g pnpm"
    exit 1
fi
log_success "pnpm est installé ($(pnpm --version))"
echo ""

# Étape 2: Nettoyage
log_info "Étape 2/6: Nettoyage des anciens builds..."
rm -rf packages/*/dist
rm -rf packages/*/node_modules
rm -rf examples/*/node_modules
rm -rf examples/*/dist
rm -rf node_modules
log_success "Nettoyage terminé"
echo ""

# Étape 3: Installation des dépendances
log_info "Étape 3/6: Installation des dépendances..."
pnpm install
if [ $? -ne 0 ]; then
    log_error "Échec de l'installation des dépendances"
    exit 1
fi
log_success "Dépendances installées"
echo ""

# Étape 4: Build des packages
log_info "Étape 4/6: Build des packages..."
pnpm build
if [ $? -ne 0 ]; then
    log_error "Échec du build"
    exit 1
fi
log_success "Build terminé"
echo ""

# Étape 5: Vérification des fichiers de build
log_info "Étape 5/6: Vérification des fichiers de build..."

check_build_files() {
    local package=$1
    local path="packages/$package/dist"

    if [ ! -d "$path" ]; then
        log_error "Dossier dist manquant pour $package"
        return 1
    fi

    if [ ! -f "$path/index.js" ]; then
        log_error "index.js manquant pour $package"
        return 1
    fi

    if [ ! -f "$path/index.mjs" ]; then
        log_error "index.mjs manquant pour $package"
        return 1
    fi

    if [ ! -f "$path/index.d.ts" ]; then
        log_error "index.d.ts manquant pour $package"
        return 1
    fi

    log_success "$package: Tous les fichiers présents"
    return 0
}

check_build_files "core"
check_build_files "react"
echo ""

# Étape 6: Rapport de taille
log_info "Étape 6/6: Rapport de taille des builds..."
echo ""
echo "📦 @zaplink/core"
du -sh packages/core/dist/ | awk '{print "   Taille: " $1}'
echo ""
echo "📦 @zaplink/react"
du -sh packages/react/dist/ | awk '{print "   Taille: " $1}'
echo ""

# Résumé final
echo ""
echo "=============================="
log_success "✨ Déploiement terminé avec succès!"
echo "=============================="
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Tester l'exemple React:"
echo "   cd examples/react-example"
echo "   pnpm install"
echo "   pnpm dev"
echo ""
echo "2. Publier sur NPM (si prêt):"
echo "   cd packages/core && npm publish --access public"
echo "   cd packages/react && npm publish --access public"
echo ""
echo "3. Créer un tag Git:"
echo "   git tag v1.0.0"
echo "   git push origin v1.0.0"
echo ""
echo "📚 Documentation: https://zaplink.filano.dev"
echo "💬 Support: support@piketplace.com"
echo ""
