DROP TRIGGER IF EXISTS stock_remove_trigger;

CREATE TRIGGER stock_remove_trigger
AFTER DELETE ON Stock
FOR EACH ROW
BEGIN
    -- Update productCount in Location after removing a Stock record
    UPDATE Location
    SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = OLD.locationId)
    WHERE id = OLD.locationId;

    -- Update qtyInStock in Product by summing all remaining Stock records for the same productId
    UPDATE Product
    SET qtyInStock = (SELECT COALESCE(SUM(qty), 0) FROM Stock WHERE productId = OLD.productId)
    WHERE id = OLD.productId;
END;
