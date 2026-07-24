module.exports = {
  apps: [
    {
      name: "email-worker",
      script: "./src/modules/Email/worker/emailWorker.ts", // Direct apni main file ka path do
      interpreter: "node", // Interpreter hamesha node rahega
      interpreter_args: "--import tsx", // Node ko bolenge tsx import karne ko
      instances: 3, // Jitne instances chahiye
      exec_mode: "cluster", // Multiple instances ke liye 'cluster' mode best hai
      watch: false,
      env: {
        NODE_ENV: "development",
        REDIS_HOST: "localhost",
        REDIS_PORT: 6379,
      },
    },
  ],
};
