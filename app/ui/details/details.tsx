import styles from "./details.module.css";

function Property({ title, value, formatter }: any) {
  let formattedValue = value;

  if (typeof formatter === "function") {
    formattedValue = formatter(value);
  }

  return (
    <div className={styles.propertyBox}>
      <span className={styles.propertyName}>{title}</span>
      <span className={styles.propertyValue}>{formattedValue}</span>
    </div>
  );
}

export const ProductDetails = ({ product }: any) => {
  const manufacturer = product.manufacturer;
  const supplier = product.supplier;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{product.name}</div>

      <div className={styles.content}>
        <div className={styles.imageBox}>
          {product.image && (
            <>
              <img src={product.image.href} />
              <span className={styles.changeImage}>change image</span>
            </>
          )}
          {!product.image && (
            <span className={styles.changeImage}>add image</span>
          )}
        </div>
        <div className={styles.propertyBoxes}>
          {manufacturer && (
            <Property title="Manufacturer" value={manufacturer.name} />
          )}
          {product.manufacturerPartNo && (
            <Property
              title="Manufacturer Part No"
              value={product.manufacturerPartNo}
            />
          )}
          {supplier && <Property title="Supplier" value={supplier.name} />}
          {product.supplierPartNo && (
            <Property title="Supplier Part No" value={product.supplierPartNo} />
          )}
          {product.cost !== null && (
            <Property
              title="Cost"
              value={product.cost}
              formatter={(v: any) =>
                v === null || v === "" ? null : "£" + v.toFixed(2)
              }
            />
          )}
          <Property title="Qty In Stock" value={product.qtyInStock} />
          {product.location && (
            <Property title="Location" value={product.location} />
          )}
        </div>
      </div>
    </div>
  );
};
