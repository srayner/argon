UPDATE `Product`
SET `qtyInStock` = (
    SELECT COALESCE(SUM(qty), 0)
    FROM `Stock`
    WHERE `Stock`.`productId` = `Product`.`id`
);

CREATE TRIGGER stock_update_trigger
AFTER UPDATE ON Stock
FOR EACH ROW
BEGIN
    -- If locationId has changed, update productCount for both old and new locations
    IF OLD.locationId <> NEW.locationId THEN
        UPDATE Location
        SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = OLD.locationId)
        WHERE id = OLD.locationId;

        UPDATE Location
        SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = NEW.locationId)
        WHERE id = NEW.locationId;
    END IF;

    -- If productId or quantity has changed, update qtyInStock for both old and new products
    IF OLD.productId <> NEW.productId OR OLD.qty <> NEW.qty THEN
        UPDATE Product
        SET qtyInStock = (SELECT COALESCE(SUM(qty), 0) FROM Stock WHERE productId = OLD.productId)
        WHERE id = OLD.productId;

        UPDATE Product
        SET qtyInStock = (SELECT COALESCE(SUM(qty), 0) FROM Stock WHERE productId = NEW.productId)
        WHERE id = NEW.productId;
    END IF;
END;