/*
  Warnings supprimés — nous avons géré les valeurs NULL avant les contraintes.
*/

-- ✅ Étape 1 : Pré-remplir les valeurs manquantes
UPDATE "User" SET "nom" = 'Inconnu' WHERE "nom" IS NULL;
UPDATE "User" SET "prenom" = 'Inconnu' WHERE "prenom" IS NULL;
UPDATE "User" SET "commune" = 'Non spécifiée' WHERE "commune" IS NULL;

-- ✅ Étape 2 : Appliquer les contraintes NOT NULL
ALTER TABLE "User"
  ALTER COLUMN "commune" SET NOT NULL,
  ALTER COLUMN "nom" SET NOT NULL,
  ALTER COLUMN "prenom" SET NOT NULL;
