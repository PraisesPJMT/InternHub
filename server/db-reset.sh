#!/bin/bash
# db-reset.sh

DB_NAME="internhub"
USER="nemesis"
PASS="CyDev"

echo "🧨 Crashing and rebuilding database..."

# Terminate connections first so the DROP doesn't fail
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();"

# Drop, Create, and Set Password
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $USER;"
sudo -u postgres psql -c "ALTER USER $USER WITH PASSWORD '$PASS';"

echo "✅ Database $DB_NAME is fresh and owned by $USER."