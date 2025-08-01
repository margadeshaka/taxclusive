#!/bin/sh
set -e

echo "🚀 Starting TaxExclusive application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U taxexclusive -d taxexclusive; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client
echo "📦 Generating Prisma client..."
pnpm prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
pnpm db:seed

# Start the Next.js application
echo "🎉 Starting Next.js application..."
exec "$@"