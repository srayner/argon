/*
  Warnings:

  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(40)`.
  - A unique constraint covering the columns `[code]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `code` VARCHAR(20) NULL,
    ADD COLUMN `depth` INTEGER NULL,
    ADD COLUMN `fullPath` VARCHAR(341) NULL,
    ADD COLUMN `imageId` INTEGER NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NULL DEFAULT 'ACTIVE',
    MODIFY `name` VARCHAR(40) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_code_key` ON `Category`(`code`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
