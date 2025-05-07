module.exports = {
  "apps": [
    {
      "name": "yahaya-bawa-library",
      "script": "server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "watch": false,
      "ignore_watch": [
        "node_modules",
        "uploads",
        "logs"
      ],
      "env": {
        "NODE_ENV": "production"
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
  ]
}