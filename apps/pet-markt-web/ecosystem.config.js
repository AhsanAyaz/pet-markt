module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'server.mjs',
      env: {
        PM2: 'true',
      },
    },
  ],
};
