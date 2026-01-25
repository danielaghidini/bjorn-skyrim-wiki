import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("Successfully connected to the database");
	} catch (err) {
		console.error("Failed to connect to the database:", err);
		// Don't throw, let the app try to run or fail on first query
	}
};
