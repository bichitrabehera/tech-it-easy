/*
  Warnings:

  - Added the required column `email` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaderPhone` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("id", "name", "teamId") SELECT "id", "name", "teamId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE INDEX "Member_teamId_idx" ON "Member"("teamId");
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamName" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderEmail" TEXT NOT NULL,
    "leaderPhone" TEXT NOT NULL,
    "pptUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "magicToken" TEXT,
    "tokenExpiry" DATETIME,
    "githubId" TEXT,
    "githubRepo" TEXT,
    "idProofUrl" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentProof" TEXT
);
INSERT INTO "new_Team" ("createdAt", "githubId", "id", "idProofUrl", "leaderEmail", "leaderName", "magicToken", "paymentProof", "paymentStatus", "pptUrl", "status", "teamName", "tokenExpiry", "updatedAt") SELECT "createdAt", "githubId", "id", "idProofUrl", "leaderEmail", "leaderName", "magicToken", "paymentProof", "paymentStatus", "pptUrl", "status", "teamName", "tokenExpiry", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_leaderEmail_key" ON "Team"("leaderEmail");
CREATE UNIQUE INDEX "Team_magicToken_key" ON "Team"("magicToken");
CREATE INDEX "Team_leaderEmail_idx" ON "Team"("leaderEmail");
CREATE INDEX "Team_status_idx" ON "Team"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
