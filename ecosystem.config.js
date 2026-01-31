module.exports = {
  apps: [
    {
      name: "admission-api",
      cwd: "./admission-api",
      script: "npm",
      args: "start",
      autorestart: true
    },
    {
      name: "auth-api",
      cwd: "./auth-api",
      script: "npm",
      args: "start",
      autorestart: false
    },
    {
      name: "healHub-api",
      cwd: "./healHub-api",
      script: "npm",
      args: "start",
      autorestart: false
    }
  ]
};
