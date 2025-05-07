# Deploying Yahaya Bawa Islamic Library Backend on Hostinger

This guide provides step-by-step instructions for deploying the Yahaya Bawa Islamic Library backend on Hostinger.

## Prerequisites

- A Hostinger account with Node.js hosting plan
- MongoDB Atlas account (or other MongoDB hosting)
- Git (optional, for version control)
- Basic knowledge of terminal/command line operations

## Step 1: Prepare Your MongoDB Database

1. Create a MongoDB Atlas account if you don't have one already
2. Create a new cluster (the free tier works fine for starting)
3. Create a database user with read/write privileges
4. Whitelist your IP address or use `0.0.0.0/0` for all IPs
5. Get your MongoDB connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `yahaya_bawa_library`

## Step 2: Prepare Your Backend Code

1. Make sure you have all the necessary files
2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Run the deployment script to set up the necessary files:
   ```
   node scripts/deploy.js
   ```
4. Install production dependencies:
   ```
   npm install --production
   ```
5. Create a ZIP file of your project excluding:
   - `node_modules/`
   - `.git/`
   - `.env` (you'll set this up in Hostinger)

## Step 3: Create and Configure Your Hostinger Node.js Project

1. Log in to your Hostinger control panel
2. Go to "Hosting" → "Your Hosting Plan"
3. Click on "Manage"
4. Navigate to "Website" → "Node.js" section
5. Click "Create a New Application"
6. Fill in the required information:
   - Application Name: `yahaya-bawa-library`
   - Node.js Version: Choose the latest LTS version (14.x or higher)
   - Startup File: `server.js`
   - Application URL: Choose your domain or subdomain
7. Click "Create"

## Step 4: Upload Your Backend Files

### Option 1: Using FTP

1. Use an FTP client (like FileZilla) to connect to your Hostinger account
2. Navigate to your Node.js application directory
3. Upload all your backend files to this directory

### Option 2: Using SSH and Git (Advanced)

1. Connect to your Hostinger server via SSH
2. Clone your repository:
   ```
   git clone your_repository_url
   ```
3. Navigate to the cloned directory
4. Install dependencies:
   ```
   npm install --production
   ```

## Step 5: Set Up Environment Variables

1. In the Hostinger control panel, go to your Node.js application
2. Find the "Environment Variables" section
3. Add the following variables:
   - `PORT`: `5000` (or whatever port Hostinger assigns)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string for JWT tokens

## Step 6: Start the Application

### Option 1: Using the Hostinger Panel

1. Go to your Node.js application in the Hostinger control panel
2. Click on the "Start" button for your application

### Option 2: Using SSH and PM2

1. Connect to your Hostinger server via SSH
2. Navigate to your application directory
3. Start the application with PM2:
   ```
   cd ~/path_to_your_app
   pm2 start ecosystem.config.js
   ```

## Step 7: Configure Domain and SSL

1. In the Hostinger control panel, go to "Domains" section
2. Set up your domain to point to your Node.js application
3. Enable SSL certificate for your domain (Hostinger provides free SSL)

## Step 8: Test Your Deployment

1. Check if your API is accessible by visiting:
   ```
   https://your-domain.com/api/books
   ```
2. Test authentication by sending a POST request to:
   ```
   https://your-domain.com/api/users/login
   ```
   with sample user credentials from the seed data

## Troubleshooting

### Application Does Not Start

1. Check the application logs in the Hostinger control panel
2. Common issues:
   - Incorrect startup file specified
   - Missing dependencies (make sure you ran `npm install --production`)
   - Incorrect environment variables

### Database Connection Issues

1. Verify your MongoDB connection string is correct
2. Ensure your MongoDB Atlas cluster is running
3. Check if your IP is whitelisted in MongoDB Atlas

### File Upload Problems

1. Make sure the upload directories exist and have proper permissions:
   ```
   mkdir -p ~/path_to_your_app/uploads/books ~/path_to_your_app/uploads/images
   chmod -R 755 ~/path_to_your_app/uploads
   ```

## Maintenance Tasks

### Restarting the Application

```
pm2 restart yahaya-bawa-library
```

### Viewing Logs

```
pm2 logs yahaya-bawa-library
```

### Updating the Application

1. Upload new files to the server
2. Run:
   ```
   pm2 reload yahaya-bawa-library
   ```

## Setting Up Automatic Database Backups

1. Connect to your Hostinger server via SSH
2. Create a backup script:
   ```bash
   #!/bin/bash
   
   # MongoDB Atlas backup script
   # Requires mongodump to be installed
   
   # Set variables
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR=~/backups/mongodb
   
   # Create backup directory if it doesn't exist
   mkdir -p $BACKUP_DIR
   
   # Run mongodump
   mongodump --uri="YOUR_MONGODB_URI" --out="$BACKUP_DIR/$TIMESTAMP"
   
   # Delete backups older than 7 days
   find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
   ```
3. Save it as `mongodb_backup.sh`
4. Make it executable:
   ```
   chmod +x mongodb_backup.sh
   ```
5. Set up a cron job to run it weekly:
   ```
   crontab -e
   ```
   Add:
   ```
   0 0 * * 0 ~/mongodb_backup.sh > ~/backup.log 2>&1
   ```

## Additional Resources

- [Hostinger Node.js Documentation](https://support.hostinger.com/en/articles/4455931-how-to-set-up-node-js-app)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

If you need further assistance with this deployment guide, please contact us at support@example.com or open an issue on the GitHub repository.