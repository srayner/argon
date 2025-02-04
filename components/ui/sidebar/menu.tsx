"use client";

import styles from "./menu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const currentPage = usePathname();
  const menuItems = [
    {
      caption: "Categories",
      url: "/dashboard/categories",
    },
    {
      caption: "Locations",
      url: "/dashboard/locations",
    },
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
              className={`text-base my-5 mx-5 list-none select-none border-l-4 ${
                item.url === currentPage
                  ? "bg-gradient-to-r from-white/10 to-white/5 border-blue-500"
                  : "border-transparent"
              }`}
            >
              <Link
                href={item.url}
                className="text-white text-opacity-60 no-underline block py-2 px-4 hover:text-white"
              >
                {item.caption}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
