import React from "react";
import { Link, useParams } from "react-router-dom";

const CategorySidebar = ({ categories }) => {
  const { slug } = useParams(); // lấy slug hiện tại để highlight

  return (
    <div className="border rounded bg-white p-3">
      <h5 className="fw-bold mb-3">Tất cả danh mục</h5>
      <ul className="list-group">
        {categories.map((parent) => (
          <li key={parent.categoryId} className="list-group-item p-2">
            <Link
              to={`/product/category/${parent.slug}`}
              className={`d-block text-decoration-none ${
                slug === parent.slug ? "fw-bold text-primary" : "text-dark"
              }`}
            >
              {parent.categoryName}
            </Link>

            {parent.children && parent.children.length > 0 && (
              <ul className="list-group list-group-flush ms-3 mt-2">
                {parent.children.map((child) => (
                  <li
                    key={child.categoryId}
                    className="list-group-item p-1 border-0"
                  >
                    <Link
                      to={`/product/category/${child.slug}`}
                      className={`d-block text-decoration-none ${
                        slug === child.slug ? "fw-bold text-primary" : "text-dark"
                      }`}
                    >
                      {child.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
