/**
 * Deployment script for Hostinger
 * 
 * This script helps set up the environment for deployment on Hostinger.
 * It ensures that the required directories exist and sets up PM2 for process management.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create necessary directories
const createDirs = () => {
  console.log('Creating necessary directories...');
  
  const dirs = [
    'uploads',
    'uploads/books',
    'uploads/images',
    'logs'
  ];
  
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
  
  // Create .gitkeep files to track empty directories in Git
  dirs.forEach(dir => {
    const gitkeepPath = path.join(__dirname, '..', dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
      console.log(`Created .gitkeep in ${dir}`);
    }
  });
};

// Check if PM2 is installed, install if not
const setupPM2 = () => {
  console.log('Setting up PM2...');
  
  try {
    execSync('pm2 --version', { stdio: 'ignore' });
    console.log('PM2 is already installed');
  } catch (error) {
    console.log('Installing PM2...');
    try {
      execSync('npm install pm2 -g', { stdio: 'inherit' });
      console.log('PM2 installed successfully');
    } catch (err) {
      console.error('Failed to install PM2:', err.message);
      process.exit(1);
    }
  }
  
  // Create PM2 ecosystem file
  const ecosystemConfig = {
    apps: [
      {
        name: 'yahaya-bawa-library',
        script: 'server.js',
        instances: 'max',
        exec_mode: 'cluster',
        watch: false,
        ignore_watch: ['node_modules', 'uploads', 'logs'],
        env: {
          NODE_ENV: 'production'
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'ecosystem.config.js'),
    `module.exports = ${JSON.stringify(ecosystemConfig, null, 2)}`
  );
  
  console.log('PM2 ecosystem file created');
};

// Create .htaccess file for Apache (Hostinger uses Apache)
const createHtaccess = () => {
  console.log('Creating .htaccess file for Hostinger...');
  
  const htaccessContent = `
# Enable the RewriteEngine
RewriteEngine On

# Handle Node.js application through Node.js handler
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server.js [QSA,L]

# Set Node.js handler
<IfModule mod_proxy.c>
  ProxyPass / http://127.0.0.1:${process.env.PORT || 5000}/
  ProxyPassReverse / http://127.0.0.1:${process.env.PORT || 5000}/
</IfModule>

# Disable directory browsing
Options -Indexes

# Set default character set
AddDefaultCharset UTF-8

# Compress text, HTML, JavaScript, CSS, and XML
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/x-javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
`;
  
  fs.writeFileSync(
    path.join(__dirname, '..', '.htaccess'),
    htaccessContent
  );
  
  console.log('.htaccess file created');
};

// Create a startup script for Hostinger
const createStartupScript = () => {
  console.log('Creating startup script...');
  
  const startupScriptContent = `#!/bin/bash
# Start the application with PM2
cd \${HOME}/path_to_your_app
npm install --production
pm2 start ecosystem.config.js
`;
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'startup.sh'),
    startupScriptContent
  );
  
  // Make it executable
  try {
    execSync(`chmod +x ${path.join(__dirname, '..', 'startup.sh')}`);
    console.log('Startup script created and made executable');
  } catch (error) {
    console.error('Failed to make startup script executable:', error.message);
  }
};

// Create a simple status checker script
const createStatusScript = () => {
  console.log('Creating status checker script...');
  
  const statusScriptContent = `#!/bin/bash
# Check application status
echo "===== Application Status ====="
pm2 status yahaya-bawa-library

echo "\\n===== System Resources ====="
echo "Memory Usage:"
free -h

echo "\\nDisk Usage:"
df -h | grep -v tmpfs

echo "\\n===== Recent Logs ====="
tail -n 20 ./logs/err.log
`;
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'check-status.sh'),
    statusScriptContent
  );
  
  // Make it executable
  try {
    execSync(`chmod +x ${path.join(__dirname, '..', 'check-status.sh')}`);
    console.log('Status checker script created and made executable');
  } catch (error) {
    console.error('Failed to make status script executable:', error.message);
  }
};

// Run all setup functions
const runDeploymentSetup = async () => {
  try {
    createDirs();
    setupPM2();
    createHtaccess();
    createStartupScript();
    createStatusScript();
    
    console.log('\nDeployment setup completed successfully!');
    console.log('\nTo deploy on Hostinger:');
    console.log('1. Upload all files to your Hostinger Node.js hosting');
    console.log('2. Configure environment variables in Hostinger control panel');
    console.log('   - MONGO_URI: Your MongoDB connection string');
    console.log('   - JWT_SECRET: A secure random string for JWT tokens');
    console.log('   - PORT: The port number (default: 5000)');
    console.log('   - NODE_ENV: Set to "production"');
    console.log('3. Run the startup script: ./startup.sh');
    console.log('4. Check status with: ./check-status.sh');
    console.log('\nNote: Replace ${HOME}/path_to_your_app in startup.sh with your actual path');
  } catch (error) {
    console.error('Deployment setup failed:', error.message);
    process.exit(1);
  }
};

runDeploymentSetup();