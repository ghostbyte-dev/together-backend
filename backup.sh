set -a
source /root/together-backend/env
set +a


# Generate timestamp (format: YYYYMMDD_HHMMSS)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

PROJECT_DIR="/root/together-backend"
# Define backup file name
MARIADB_BACKUP_FILE="backup_$TIMESTAMP.sql.gz"
PUBLIC_BACKUP_FILE="public_backup_$TIMESTAMP.tar.gz"

/usr/bin/docker exec mariadb sh -c "mysqldump \
  -u$MYSQL_USER \
  -p$MYSQL_PASSWORD \
  --databases $MYSQL_DATABASE \
  | gzip > /$MARIADB_BACKUP_FILE"

/usr/bin/docker cp mariadb:/$MARIADB_BACKUP_FILE /root/together-backup/

/usr/bin/docker exec mariadb rm /$MARIADB_BACKUP_FILE

tar -czf /root/together-backup/$PUBLIC_BACKUP_FILE -C "$PROJECT_DIR/public" .

echo "Backup completed:"
echo "  - MongoDB: /root/together-backup/$MONGO_BACKUP_FILE"
echo "  - Public folder: /root/together-backup/$PUBLIC_BACKUP_FILE"