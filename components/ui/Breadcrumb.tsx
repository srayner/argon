"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((path) => path);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...pathArray.map((path, index) => ({
      name: path[0].toUpperCase() + path.slice(1),
      href: "/" + pathArray.slice(0, index + 1).join("/"),
    })),
  ];

  return (
    <nav aria-label="breadcrumb" className="pb-2">
      <ol className="list-none flex flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={index}
              className={`text-sm ${
                isLast
                  ? "text-neutral font-bold"
                  : "text-primary after:content-['/'] after:mx-2"
              }`}
            >
              {isLast ? (
                breadcrumb.name
              ) : (
                <Link href={breadcrumb.href}>{breadcrumb.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
