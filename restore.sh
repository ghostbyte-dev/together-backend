#!/bin/bash
set -a
source /root/together-backend/.env
set +a

# Set your backup file names here (or pass as args)
MARIADB_BACKUP_FILE="$1"
PUBLIC_BACKUP_FILE="$2"

if [[ -z "$MARIADB_BACKUP_FILE" || -z "$PUBLIC_BACKUP_FILE" ]]; then
  echo "Usage: $0 <mariadb_backup.sql.gz> <public_backup.tar.gz>"
  exit 1
fi

PROJECT_DIR="/root/together-backend"

echo "Starting restore..."

# Copy MariaDB backup into container
echo "Copying MariaDB backup $MARIADB_BACKUP_FILE into container..."
docker cp "$MARIADB_BACKUP_FILE" together-backend-mariadb-1:/backup.sql.gz

# Restore database inside container
echo "Restoring MariaDB database from $MARIADB_BACKUP_FILE..."
docker exec together-backend-mariadb-1 sh -c "gunzip < /backup.sql.gz | mariadb -u$MYSQL_USER -p$MYSQL_PASSWORD"

# Remove backup file from container
docker exec together-backend-mariadb-1 rm /backup.sql.gz

# Extract public folder backup to your project
echo "Extracting public folder backup $PUBLIC_BACKUP_FILE to $PROJECT_DIR/uploads..."
mkdir -p ./uploads
tar -xzf "$PUBLIC_BACKUP_FILE" -C $PROJECT_DIR/uploads

echo "Restore completed."
