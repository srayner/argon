"use client";

import styles from "./menu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const currentPage = usePathname();
  const menuItems = [
    {
      caption: "Manufacturers",
      url: "/dashboard/manufacturers",
    },
    {
      caption: "Products",
      url: "/dashboard/products",
    },
    {
      caption: "Suppliers",
      url: "/dashboard/suppliers",
    },
    {
      caption: "Images",
      url: "/dashboard/images",
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
