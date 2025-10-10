import React from "react";
import { useLocation } from "react-router-dom";

const PaymentResult = () => {
  const query = new URLSearchParams(useLocation().search);
  const code = query.get("code");
  const orderInfo = query.get("orderInfo");
  const amount = query.get("amount");
  const txn = query.get("txn");
  const bank = query.get("bank");
  const date = query.get("date");

  // Xử lý trạng thái
  const success = code === "00";
  const cancel = code === "24";

  const statusText = success
    ? "Thanh toán thành công"
    : cancel
    ? "Bạn đã hủy thanh toán"
    : "Thanh toán thất bại";

  const statusColor = success ? "#4CAF50" : cancel ? "#FFA000" : "#F44336";
  const statusIcon = success ? "✅" : cancel ? "⚠️" : "❌";

  // Format ngày từ dạng 20251008215724
  const formatDate = (str) => {
    if (!str || str.length !== 14) return str;
    const y = str.slice(0, 4);
    const m = str.slice(4, 6);
    const d = str.slice(6, 8);
    const h = str.slice(8, 10);
    const min = str.slice(10, 12);
    const s = str.slice(12, 14);
    return `${d}/${m}/${y} ${h}:${min}:${s}`;
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Thông tin giao dịch VNPAY
      </h2>

      <div
        style={{
          textAlign: "center",
          color: statusColor,
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        {statusIcon} {statusText}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <tbody>
          <tr>
            <th style={styles.th}>Mã đơn hàng</th>
            <td style={styles.td}>{orderInfo}</td>
          </tr>
          <tr>
            <th style={styles.th}>Số tiền</th>
            <td style={styles.td}>{Number(amount) / 100} VNĐ</td>
          </tr>
          <tr>
            <th style={styles.th}>Mã giao dịch</th>
            <td style={styles.td}>{txn}</td>
          </tr>
          <tr>
            <th style={styles.th}>Ngân hàng</th>
            <td style={styles.td}>{bank}</td>
          </tr>
          <tr>
            <th style={styles.th}>Ngày giao dịch</th>
            <td style={styles.td}>{formatDate(date)}</td>
          </tr>
          <tr>
            <th style={styles.th}>Trạng thái</th>
            <td style={styles.td}>
              <span style={{ color: statusColor, fontWeight: "600" }}>
                {statusText}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  th: {
    textAlign: "left",
    padding: "12px 15px",
    background: "#f4f4f4",
    borderBottom: "1px solid #ddd",
    width: "40%",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
  },
};

export default PaymentResult;
