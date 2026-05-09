import "reflect-metadata";
import { AppDataSource } from "@/database/datasource";

export const getDb = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Database initialized");
    } catch (error) {
      console.error("Error during database initialization:", error);
      throw error;
    }
  }
  return AppDataSource;
};
