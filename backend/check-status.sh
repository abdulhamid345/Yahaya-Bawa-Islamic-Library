#!/bin/bash
# Check application status
echo "===== Application Status ====="
pm2 status yahaya-bawa-library

echo "\n===== System Resources ====="
echo "Memory Usage:"
free -h

echo "\nDisk Usage:"
df -h | grep -v tmpfs

echo "\n===== Recent Logs ====="
tail -n 20 ./logs/err.log
