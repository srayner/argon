"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((path) => path);

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link href="/">Home</Link>
        </li>
        {pathArray.map((path, index) => {
          const href = "/" + pathArray.slice(0, index + 1).join("/");
          const caption = path[0].toUpperCase() + path.slice(1);
          const isLast = index === pathArray.length - 1;

          return (
            <li
              key={index}
              className={`${styles.breadcrumbItem} ${
                isLast ? styles.active : ""
              }`}
            >
              {isLast ? (
                <span>{caption}</span>
              ) : (
                <Link href={href}>{caption}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
