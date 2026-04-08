require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment");
  }
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });
  
  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }
  
  await prisma.admin.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
    },
  });
  
  console.log("Admin created successfully:");
  console.log(`Email: ${email}`);
  console.log("Password: [hidden]");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
