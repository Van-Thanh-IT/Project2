import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const TransactionDetailModal = ({ show, onHide, transaction, variant, user, order, transactionTypeVN, transactionSourceVN }) => {
  if (!transaction) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết giao dịch #{transaction.transactionId}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table bordered>
          <tbody>
            <tr>
              <th>Mã giao dịch</th>
              <td>{transaction.transactionId}</td>
            </tr>
            <tr>
              <th>Mã biến thể</th>
              <td>{transaction.variantId}</td>
            </tr>
            <tr>
              <th>Tên sản phẩm</th>
              <td>{variant?.productName || "Không có"}</td>
            </tr>
            <tr>
              <th>Màu</th>
              <td>{variant?.color || "Không có"}</td>
            </tr>
            <tr>
              <th>Kích thước</th>
              <td>{variant?.size || "Không có"}</td>
            </tr>
            <tr>
              <th>Trọng lượng</th>
              <td>{variant?.weight || "Không có"} kg</td>
            </tr>
            <tr>
              <th>Loại giao dịch</th>
              <td>{transactionTypeVN[transaction.transactionType]}</td>
            </tr>
            <tr>
              <th>Số lượng</th>
              <td>{transaction.quantity}</td>
            </tr>
            <tr>
              <th>Đơn giá</th>
              <td>{transaction.unitCost}</td>
            </tr>
            <tr>
              <th>Nguồn</th>
              <td>{transactionSourceVN[transaction.transactionSource]}</td>
            </tr>
            <tr>
              <th>Người thực hiện</th>
              <td>{user?.fullName || "Không rõ"}</td>
            </tr>
            <tr>
              <th>Mã đơn liên quan</th>
              <td>{order?.orderId || "Không có"}</td>
            </tr>
            <tr>
              <th>Ngày giao dịch</th>
              <td>{transaction.transactionDate}</td>
            </tr>
            <tr>
              <th>Ghi chú</th>
              <td>{transaction.note || "Không có"}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetailModal;
