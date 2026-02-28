/*
  Warnings:

  - A unique constraint covering the columns `[examId,name,booklet]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booklet` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN "booklet" TEXT NOT NULL DEFAULT '가';

ALTER TABLE "Subject" ALTER COLUMN "booklet" DROP DEFAULT;


-- CreateIndex
CREATE UNIQUE INDEX "Subject_examId_name_booklet_key" ON "Subject"("examId", "name", "booklet");
