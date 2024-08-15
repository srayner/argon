-- AlterTable
ALTER TABLE `Manufacturer` ADD COLUMN `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `imageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manufacturer` ADD CONSTRAINT `Manufacturer_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
