const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@supernova.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error("ERROR: ADMIN_PASSWORD environment variable is required");
  console.error("Set it with: set ADMIN_PASSWORD=your-secure-password");
  process.exit(1);
}

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaLibSql } = await import("@prisma/adapter-libsql");
  const { default: bcrypt } = await import("bcryptjs");

  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 12);

    await prisma.admin.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
      },
    });

    console.log("Admin created successfully:");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log("Password: [HIDDEN - set via ADMIN_PASSWORD env var]");
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
