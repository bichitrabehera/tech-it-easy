const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const bcrypt = require("bcryptjs");

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@supernova.com";
  const password = "admin123";
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });
  
  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }
  
  const admin = await prisma.admin.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
    },
  });
  
  console.log("Admin created successfully!");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
