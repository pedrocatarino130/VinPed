#!/bin/bash

# VinPed Bank - Setup Script
# This script sets up the development environment

set -e

echo "🚀 VinPed Bank - Setup Script"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo ""
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Check npm
echo ""
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm version: $(npm -v)${NC}"

# Check PostgreSQL (optional for Docker users)
echo ""
echo "📦 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL version: $(psql --version)${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found. You'll need Docker or install PostgreSQL manually.${NC}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy environment files if they don't exist
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env already exists, skipping...${NC}"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env file${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists, skipping...${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✅ Created frontend/.env file${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env already exists, skipping...${NC}"
fi

# Ask if user wants to setup database
echo ""
read -p "Do you want to setup the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🗄️  Setting up database..."

    # Check if using Docker
    read -p "Are you using Docker for PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting PostgreSQL with Docker Compose..."
        docker-compose up -d postgres
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
    else
        # Create database manually
        read -p "Enter database name (default: vinped_bank): " DB_NAME
        DB_NAME=${DB_NAME:-vinped_bank}

        echo "Creating database..."
        createdb $DB_NAME 2>/dev/null || echo "Database may already exist"
    fi

    # Run migrations
    echo ""
    echo "Running migrations..."
    npm run db:migrate

    # Seed database
    echo ""
    read -p "Do you want to seed the database with default categories? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run db:seed
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    fi

    echo -e "${GREEN}✅ Database setup complete${NC}"
fi

# Final instructions
echo ""
echo "=============================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your .env files with proper configuration"
echo "2. Start the development servers with: npm run dev"
echo "3. Frontend will be at: http://localhost:3000"
echo "4. Backend will be at: http://localhost:5000"
echo ""
echo "For deployment instructions, see: DEPLOYMENT.md"
echo ""
