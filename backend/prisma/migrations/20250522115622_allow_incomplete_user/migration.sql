-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_communeId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "nom" DROP NOT NULL,
ALTER COLUMN "prenom" DROP NOT NULL,
ALTER COLUMN "communeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;
