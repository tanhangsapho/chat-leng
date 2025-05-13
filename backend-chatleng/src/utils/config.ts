import dotenv from "dotenv";
// import APIError from "../errors/api-error";
import path from "path";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = ["NODE_ENV", "PORT", "MONGODB_URL", "LOG_LEVEL"];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }
  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    mongoUrl: process.env.MONGODB_URL,
  };
}

const getConfig = (currentEnv: string = "development") => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../.env`)
      : path.join(__dirname, `../../.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
