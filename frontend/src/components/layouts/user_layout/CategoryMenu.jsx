import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/CategoryMenu.module.scss";

const CategoryMenu = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  const allCategories = categories;

  return (
    <div className={styles.wrapper}>
    <h1 className="text-center">Danh mục</h1>
      <div className={styles.grid}>
        {allCategories.map((cat) => (
          <Link
            to={`/product/category/${cat.slug}`}
            key={cat.categoryId}
            className={styles.itemLink}
          >
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={`${cat.imageUrl}`}
                  alt={cat.categoryName}
                />
              </div>

              <div className={styles.name}>{cat.categoryName}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
