#!/bin/sh

set -x  # Modo debug para ver qué comandos se ejecutan

# Verificar si hay un volumen montado en /app
if mount | grep 'on /app type' > /dev/null; then
  echo "❌ ERROR: Este proyecto está protegido. No puedes montar un volumen en /app"
  exit 1
else
  echo "✅ No se detectó volumen montado en /app."
fi

# Determinar qué proceso ejecutar según la variable de entorno
if [ "$SIDEKIQ_ENABLED" = "true" ]; then
  echo "🔄 Iniciando Sidekiq..."
  exec bundle exec sidekiq -C config/sidekiq.yml
else
  echo "🚀 Iniciando Rails..."
  exec bundle exec rails s -p 3000 -b 0.0.0.0
fi
