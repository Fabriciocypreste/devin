#!/bin/bash

echo "============================================"
echo "REDFLIX - INSTALACAO GARANTIDA"
echo "============================================"
echo ""

echo "[1/5] Parando processos Node..."
killall node 2>/dev/null || true

echo "[2/5] Limpando instalacoes antigas..."
rm -rf node_modules package-lock.json

echo "[3/5] Limpando cache npm..."
npm cache clean --force

echo "[4/5] Instalando dependencias..."
npm install --legacy-peer-deps

echo "[5/5] Iniciando servidor..."
echo ""
echo "============================================"
echo "PRONTO! Site vai abrir automaticamente!"
echo "============================================"
echo ""
npm run dev
