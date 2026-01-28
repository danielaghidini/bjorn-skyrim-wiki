import { prisma } from "./db.js";

async function main() {
	console.log("Prisma instance initialized:", prisma);
	try {
		await prisma.$connect();
		console.log("Connected successfully");
	} catch (e) {
		console.error("Connection failed:", e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
