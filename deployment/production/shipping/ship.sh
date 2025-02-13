#!/bin/sh

# 🔹 Remote server details
SERVER_IP="85.215.172.45"
REMOTE_USER="root"
REMOTE_DIR="/var/www/fangemeinschaft"
SSH_PORT=22

# 🔹 Deployment mode (default: normal)
DEPLOY_SCRIPT="remote_build.sh"
PATH_TO_SCRIPT="deployment/production/shipping/"

# 🔹 Check if "clean" argument is passed
if [ "$1" = "clean" ]; then
    DEPLOY_SCRIPT="clean_remote_build.sh"
fi

# 🔹 List of folders to transfer (Modify as needed)
FOLDERS_TO_TRANSFER=(
    "../../../dist"
    "../../../tests"
    "../../../logs"
    "../../../uploads"
    "../../../configs"
    "../../../cache"
    "../../../deployment"
    "../../../prisma"
)

# 🔹 List of specific files to transfer (Modify as needed)
FILES_TO_TRANSFER=(
    "../../../.env.production"
    "../../../package.json"
    "../../../package-lock.json"
    "../../../astro.config.mjs"
)

# 🔹 Open SSH connection in the background
echo "🔐 Opening SSH connection..."
ssh -M -S /tmp/ssh_socket -fnNT -o ControlPersist=600 -o StrictHostKeyChecking=no -p $SSH_PORT $REMOTE_USER@$SERVER_IP

# 🔹 Create the deployment directory on the remote server
echo "📂 Creating directory on server: $REMOTE_DIR"
ssh -S /tmp/ssh_socket -p $SSH_PORT $REMOTE_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# 🔹 Transfer all folders recursively
echo "🚀 Transferring folders..."
for FOLDER in "${FOLDERS_TO_TRANSFER[@]}"; do
    echo "📂 Sending folder: $FOLDER"
    scp -r -o ControlPath=/tmp/ssh_socket -P $SSH_PORT "$FOLDER" "$REMOTE_USER@$SERVER_IP:$REMOTE_DIR/"
done

# 🔹 Transfer all specific files
echo "🚀 Transferring specific files..."
for FILE in "${FILES_TO_TRANSFER[@]}"; do
    echo "📦 Sending: $FILE"
    scp -o ControlPath=/tmp/ssh_socket -P $SSH_PORT "$FILE" "$REMOTE_USER@$SERVER_IP:$REMOTE_DIR/"
done

# 🔹 Restart Docker Compose with the correct script
echo "🔄 Restarting with $DEPLOY_SCRIPT..."
ssh -S /tmp/ssh_socket -p $SSH_PORT $REMOTE_USER@$SERVER_IP "cd $REMOTE_DIR/$PATH_TO_SCRIPT && sh $DEPLOY_SCRIPT"

# 🔹 Close SSH connection
echo "🔒 Closing SSH connection..."
ssh -S /tmp/ssh_socket -O exit $REMOTE_USER@$SERVER_IP

# ✅ Success Message
echo "✅ Deployment completed successfully to $SERVER_IP!"
