#!/bin/bash
set -e

echo "🐳 Starting TaxExclusive with Docker..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove any existing volumes (optional - comment out to keep data)
echo "🗑️  Removing existing volumes..."
docker-compose down -v

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Show container status
echo "📋 Container status:"
docker-compose ps

# Show logs from the app
echo "📜 Application logs:"
docker-compose logs app

echo ""
echo "🎉 TaxExclusive is now running!"
echo "🌐 Website: http://localhost:3000"
echo "🔐 Admin Portal: http://localhost:3000/admin"
echo "🗄️  Database Admin: http://localhost:8080"
echo ""
echo "👤 Login Credentials:"
echo "   Admin: admin@taxexclusive.com / admin123"
echo "   Editor: editor@taxexclusive.com / editor123"
echo ""
echo "📊 Database Connection (for Adminer):"
echo "   System: PostgreSQL"
echo "   Server: postgres"
echo "   Username: taxexclusive"
echo "   Password: taxexclusive123"
echo "   Database: taxexclusive"
echo ""
echo "🔧 Useful commands:"
echo "   docker-compose logs app    # View app logs"
echo "   docker-compose logs postgres    # View database logs"
echo "   docker-compose down    # Stop all services"
echo "   docker-compose up -d    # Start services in background"