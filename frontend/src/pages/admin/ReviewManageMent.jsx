import React, { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
  toggleReviewVisibility
} from "../../services/ReviewService";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaTrash, FaCheckCircle } from "react-icons/fa";

const ReviewManageMent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Xóa đánh giá thành công!");
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };

  const handleToggleStatus = async (review, newStatus) => {
    if(!window.confirm(`Bạn có chắc chẵn muốn cập nhật trạng thái: ${newStatus} này không`)) return;
    try {
      await toggleReviewVisibility(review.reviewId, newStatus);
      toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const filteredReviews =
    filterStatus === "ALL"
      ? reviews
      : reviews.filter((r) => r.status === filterStatus);

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold page-title">📋 Quản lý đánh giá</h2>

      {/* Bộ lọc trạng thái */}
      <div className="mb-3 d-flex justify-content-end">
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Đang chờ duyệt</option>
          <option value="APPROVED">Hiển thị</option>
          <option value="HIDDEN">Ẩn</option>
        </select>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Người dùng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Bình luận</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: "220px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <tr key={review.reviewId}>
                    <td className="text-center">{index + 1}</td>
                    <td>{review.users?.fullName || "N/A"}</td>
                    <td>{review.products?.productName || "N/A"}</td>
                    <td className="text-center">{review.rating} ⭐</td>
                    <td>{review.comment || "—"}</td>
                    <td className="text-center">
                      {review.status === "APPROVED" ? (
                        <span className="badge bg-success">Hiển thị</span>
                      ) : review.status === "PENDING" ? (
                        <span className="badge bg-warning text-dark">
                          Đang chờ duyệt
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Ẩn</span>
                      )}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleString()}</td>

                    <td className="text-center" style={{ width: "250px" }}>
                      {review.status === "PENDING" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() =>
                              handleToggleStatus(review, "APPROVED")
                            }
                          >
                            <FaCheckCircle className="me-1" /> Duyệt
                          </button>
                          <button
                            className="btn btn-sm btn-secondary me-2"
                            onClick={() =>
                              handleToggleStatus(review, "HIDDEN")
                            }
                          >
                            <FaEyeSlash className="me-1" /> Ẩn
                          </button>
                        </>
                      )}

                      {review.status === "APPROVED" && (
                        <button
                          className="btn btn-sm btn-dark me-2"
                          onClick={() => handleToggleStatus(review, "HIDDEN")}
                        >
                          <FaEyeSlash className="me-1" /> Ẩn
                        </button>
                      )}

                      {review.status === "HIDDEN" && (
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() =>
                            handleToggleStatus(review, "APPROVED")
                          }
                        >
                          <FaEye className="me-1" /> Hiển thị
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(review.reviewId)}
                      >
                        <FaTrash className="me-1" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-3">
                    Không có đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewManageMent;
