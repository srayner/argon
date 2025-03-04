DROP TRIGGER IF EXISTS stock_count_trigger;

CREATE TRIGGER stock_count_trigger
AFTER INSERT ON Stock
FOR EACH ROW
BEGIN
    -- Update productCount in Location after adding a Stock record
    UPDATE Location
    SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = NEW.locationId)
    WHERE id = NEW.locationId;

    -- Update qtyInStock in Product by summing all Stock records for the same productId
    UPDATE Product
    SET qtyInStock = (SELECT COALESCE(SUM(qty), 0) FROM Stock WHERE productId = NEW.productId)
    WHERE id = NEW.productId;
END;
