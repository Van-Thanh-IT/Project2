import React, { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
  updateReview,
  toggleReviewVisibility
} from "../../services/ReviewService";
import { toast } from "react-toastify";

const ReviewManageMent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal sửa
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  // Lọc theo trạng thái
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchReviews();
  }, []);

  // Lấy danh sách
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

  // Xóa
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

  // Mở modal sửa
  const openEditModal = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
    setShowEditModal(true);
  };

  // Lưu chỉnh sửa
  const handleUpdate = async () => {
    try {
      await updateReview(editingReview.reviewId, editForm);
      toast.success("Cập nhật đánh giá thành công!");
      setShowEditModal(false);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  // Ẩn / Hiện
  const handleToggleStatus = async (review) => {
    const newStatus = review.status === "APPROVED" ? "HIDDEN" : "APPROVED";
    try {
      await toggleReviewVisibility(review.reviewId, newStatus);
      toast.success(`Đã chuyển sang trạng thái ${newStatus}`);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  // Lọc theo trạng thái
  const filteredReviews =
    filterStatus === "ALL"
      ? reviews
      : reviews.filter((r) => r.status === filterStatus);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">📋 Quản lý đánh giá</h2>

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
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Mã</th>
                <th>Người dùng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Bình luận</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: "180px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <tr key={review.reviewId}>
                    <td>{index + 1}</td>
                    <td>{review.users?.userId || "N/A"}</td>
                    <td>{review.products?.productId || "N/A"}</td>
                    <td>{review.rating} ⭐</td>
                    <td>{review.comment || "—"}</td>
                    <td>
                      {review.status === "APPROVED" ? (
                        <span className="badge bg-success">Hiển thị</span>
                      ) : review.status === "PENDING" ? (
                        <span className="badge bg-warning text-dark">Đang chờ duyệt</span>
                      ) : (
                        <span className="badge bg-secondary">Ẩn</span>
                      )}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => openEditModal(review)}
                      >
                        Sửa
                      </button>
                      {review.status === "PENDING" ? (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleToggleStatus(review)}
                        >
                          Duyệt
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary me-2"
                          onClick={() => handleToggleStatus(review)}
                        >
                          Ẩn
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(review.reviewId)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    Không có đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal sửa */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa đánh giá</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Số sao (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.rating}
                    min="1"
                    max="5"
                    onChange={(e) =>
                      setEditForm({ ...editForm, rating: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Bình luận</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editForm.comment}
                    onChange={(e) =>
                      setEditForm({ ...editForm, comment: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Đóng
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal */}
    </div>
  );
};

export default ReviewManageMent;
