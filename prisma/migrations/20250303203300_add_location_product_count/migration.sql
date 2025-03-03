-- AlterTable
ALTER TABLE `Location` ADD COLUMN `productCount` INTEGER NULL;

UPDATE `Location`
SET `productCount` = (
    SELECT COUNT(*)
    FROM `Stock`
    WHERE `Stock`.`locationId` = `Location`.`id`
);
