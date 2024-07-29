import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div>
        <h1 className={styles.heading}>Stock Control</h1>

        <section className={styles.section}>
          <h2>Manufacturers</h2>
          <p>
            Manufacturers produce products. Each product may have a single
            manufacturer.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Products</h2>
          <p>
            Products are the center of the stock control system. We can record
            the quantity of stock we have for each product, and specify a
            location making the products easy to find.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Suppliers</h2>
          <p>
            We can buy products from suppliers. Each product may have a single
            supplier.
          </p>
        </section>
      </div>
    </main>
  );
}
