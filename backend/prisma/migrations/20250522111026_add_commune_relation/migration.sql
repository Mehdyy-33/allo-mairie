/*
  Migration corrigée pour ajouter communeId à User sans erreur
*/

-- ✅ Étape 1 : Créer la table Commune
CREATE TABLE "Commune" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- ✅ Étape 2 : Ajouter une commune par défaut si nécessaire
INSERT INTO "Commune" ("id", "nom", "active")
VALUES (999, 'Commune par défaut', true);

-- ✅ Étape 3 : Supprimer ancienne colonne texte "commune"
ALTER TABLE "User" DROP COLUMN "commune";

-- ✅ Étape 4 : Ajouter colonne communeId (optionnelle au début)
ALTER TABLE "User" ADD COLUMN "communeId" INTEGER;

-- ✅ Étape 5 : Affecter la commune par défaut aux anciens utilisateurs
UPDATE "User" SET "communeId" = 999 WHERE "communeId" IS NULL;

-- ✅ Étape 6 : Rendre la colonne communeId obligatoire
ALTER TABLE "User" ALTER COLUMN "communeId" SET NOT NULL;

-- ✅ Étape 7 : Ajouter la contrainte de clé étrangère
ALTER TABLE "User" ADD CONSTRAINT "User_communeId_fkey"
FOREIGN KEY ("communeId") REFERENCES "Commune"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- ✅ Étape 8 : Créer l'index sur le nom (unique)
CREATE UNIQUE INDEX "Commune_nom_key" ON "Commune"("nom");
