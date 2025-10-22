import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/CategoryMenu.module.scss";

const CategoryMenu = ({ categories }) => {
  const [expanded, setExpanded] = useState(false); // ✅ gọi đầu tiên

  if (!Array.isArray(categories) || categories.length === 0) return null;

  const columns = 10; // 10 cột
  const rows = 2; // 2 hàng
  const initialShowCount = columns * rows;

  const displayedCategories = expanded
    ? categories
    : categories.slice(0, initialShowCount);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className={styles.wrapper}>
      <h1 className="text-center">Danh mục</h1>
      <div className={styles.grid}>
        {displayedCategories.map((cat) => (
          cat.isActive ? 
          <Link
            to={`/product/category/${cat.slug}`}
            key={cat.categoryId}
            className={styles.itemLink}
          >
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={cat.imageUrl || "/default.png"}
                  alt={cat.categoryName || "Category"}
                />
              </div>
              <div className={styles.name}>
                {cat.categoryName || "Không tên"}
              </div>
            </div>
          </Link>
        : null
        ))}
      </div>

      {categories.length > initialShowCount && (
        <div className={styles.toggleBtnWrapper}>
          <button onClick={toggleExpand} className={styles.toggleBtn}>
            {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
