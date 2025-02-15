"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const currentPage = usePathname();
  const menuItems = [
    {
      caption: "Categories",
      url: "/dashboard/categories",
      e2e: "categories-link",
    },
    {
      caption: "Locations",
      url: "/dashboard/locations",
      e2e: "locations-link",
    },
    {
      caption: "Manufacturers",
      url: "/dashboard/manufacturers",
      e2e: "manufacturers-link",
    },
    {
      caption: "Products",
      url: "/dashboard/products",
      e2e: "products-link",
    },
    {
      caption: "Suppliers",
      url: "/dashboard/suppliers",
      e2e: "suppliers-link",
    },
    {
      caption: "Images",
      url: "/dashboard/images",
      e2e: "images-link",
    },
  ];

  return (
    <div className="mt-8">
      <ul>
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
                data-e2e={item.e2e}
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
