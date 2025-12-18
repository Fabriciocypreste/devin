#!/bin/bash

echo "🧹 Limpando cache do npm..."
rm -rf node_modules package-lock.json

echo "📦 Instalando dependências da raiz..."
npm install

echo "📦 Instalando dependências do src..."
cd src
rm -rf node_modules package-lock.json
npm install
cd ..

echo "✅ Instalação completa!"
echo ""
echo "Para rodar o projeto, execute:"
echo "  npm run dev"
