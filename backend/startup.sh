#!/bin/bash
# Start the application with PM2
cd ${HOME}/path_to_your_app
npm install --production
pm2 start ecosystem.config.js
