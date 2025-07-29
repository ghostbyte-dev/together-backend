/*
  Warnings:

  - You are about to drop the column `lastModified` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `lastModified`,
    ADD COLUMN `doneDate` DATETIME(0) NULL;
