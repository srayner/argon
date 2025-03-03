CREATE TRIGGER stock_count_trigger
AFTER INSERT ON Stock
FOR EACH ROW
BEGIN
    -- For INSERT operation: Update productCount after adding a Stock record
    IF (NEW.locationId IS NOT NULL) THEN
        UPDATE Location
        SET productCount = (SELECT COUNT(*) FROM Stock WHERE locationId = NEW.locationId)
        WHERE id = NEW.locationId;
    END IF;
END
