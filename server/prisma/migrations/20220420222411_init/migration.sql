/*
  Warnings:

  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `moodScore` to the `MoodEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoodEntry" ADD COLUMN     "moodScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "name";
