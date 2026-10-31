// PM2 config: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "clashback",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
