const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Connected to DB, users:", users.length);
  } catch (e) {
    console.error("Error connecting to DB:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
