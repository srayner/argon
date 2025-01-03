/*
  Warnings:

  - Added the required column `updatedAt` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Property` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `unitPosition` ENUM('PREFIX', 'SUFFIX') NOT NULL DEFAULT 'SUFFIX',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `type` ENUM('STRING', 'NUMERIC', 'METRIC', 'IMPERIAL') NOT NULL;
