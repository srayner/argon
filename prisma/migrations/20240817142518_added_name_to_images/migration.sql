/*
  Warnings:

  - Added the required column `name` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `name` VARCHAR(128) NOT NULL;
