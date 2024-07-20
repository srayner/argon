import styles from "./menu.module.css";
import Link from "next/link";

export default function menu({ currentPage }) {
  const menuItems = [
    {
      caption: "Manufacturers",
      url: "/manufacturers",
    },
    {
      caption: "Products",
      url: "/products",
    },
    {
      caption: "Suppliers",
      url: "/suppliers",
    },
  ];

  return (
    <div className={styles.container}>
      <ul className={styles.menu}>
        {menuItems.map((item) => {
          return (
            <li
              key={item.url}
              className={`${styles.item} ${
                item.url === currentPage ? styles.selected : ""
              }`}
            >
              <Link href={item.url}>{item.caption}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
