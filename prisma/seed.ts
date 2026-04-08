import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function main() {
  // Create default admin
  const email = "admin@supernova.com";
  const password = "admin123"; // Change this in production
  
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
      password: hashPassword(password),
    },
  });
  
  console.log("Admin created successfully:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
