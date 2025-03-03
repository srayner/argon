CREATE TRIGGER stock_remove_trigger
AFTER DELETE ON Stock
FOR EACH ROW
BEGIN
    -- For DELETE operation: Update productCount after removing a Stock record
    IF (OLD.locationId IS NOT NULL) THEN
        UPDATE Location
        SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = OLD.locationId)
        WHERE id = OLD.locationId;
    END IF;
END