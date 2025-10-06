import React, { useEffect, useState } from "react";
import {
  getAllInventory,
  updateInventory,
  getAllTransactions,
  createTransaction,
} from "../../services/InventoryService";
import { Table, Button, Spinner, Form } from "react-bootstrap";
import UpdateInventoryModal from "../../components/modal/UpdateInventoryModal";
import TransactionModal from "../../components/modal/TransactionModal";
import { toast } from "react-toastify";
import "../../styles/global.scss";
import ExportCSV from "../../utils/exportCSV";

const CURRENT_USER_ID = 28;

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionPayload, setTransactionPayload] = useState({
    variantId: "",
    transactionType: "IMPORT",
    quantity: 0,
    unitCost: 0,
    transactionSource: "PURCHASE",
    referenceId: null,
    createdBy: CURRENT_USER_ID,
    note: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const transactionTypeVN = { IMPORT: "Nhập", EXPORT: "Xuất" };
  const transactionSourceVN = {
    PURCHASE: "Mua hàng",
    SALE: "Bán hàng",
    RETURN: "Trả hàng",
    ADJUSTMENT: "Điều chỉnh",
  };

  // Fetch dữ liệu tồn kho & giao dịch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, transRes] = await Promise.all([
        getAllInventory(),
        getAllTransactions(),
      ]);
      setInventories(invRes?.data || []);
      setFilteredInventories(invRes?.data || []);
      setTransactions(transRes || []);
    } catch (err) {
      toast.error(err.response?.messages || "Lỗi khi tải dữ liệu");
      console.error("Lỗi khi fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tìm kiếm động theo variantId hoặc inventoryId
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);

    const filtered = inventories.filter(
      (inv) =>
        inv.variantId.toString().includes(term) ||
        inv.inventoryId.toString().includes(term)
    );
    setFilteredInventories(filtered);
  };

  // Cập nhật tồn kho
  const handleUpdateClick = (inv) => {
    setSelectedInventory(inv);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      await updateInventory(selectedInventory.inventoryId, selectedInventory);
      setShowUpdateModal(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Nhập/Xuất tồn kho
  const handleTransactionClick = (variantId) => {
    setTransactionPayload({
      ...transactionPayload,
      variantId,
      createdBy: CURRENT_USER_ID,
      quantity: 0,
      unitCost: 0,
      transactionSource: "PURCHASE",
      referenceId: null,
      note: "",
    });
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = async () => {
    if (transactionPayload.quantity <= 0)
      return alert("Số lượng phải lớn hơn 0");
    setLoading(true);
    try {
      await createTransaction(transactionPayload);
      setShowTransactionModal(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.messages || "Lỗi khi tạo giao dịch");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="container">
      <h2 className="mb-3">Quản lý tồn kho</h2>

      {/* Tìm kiếm & Xuất file */}
      <div className="d-flex mb-3 justify-content-between">
        <Form.Control
          type="text"
          className="w-50"
          placeholder="Tìm kiếm Variant ID hoặc Mã kho..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="d-flex gap-2 " >
           <Button
          variant="info"
          
          onClick={() => ExportCSV(filteredInventories, "tonkho.csv")}
        >
          Xuất File tồn kho
        </Button>
        <Button
          variant="warning"
          onClick={() => ExportCSV(transactions, "giaodich.csv")}
        >
          Xuất File giao dịch
        </Button>
        </div>
       
      </div>


      {/* Bảng tồn kho */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark">
          <thead>
            <tr>
              <th>Mã kho</th>
              <th>Variant ID</th>
              <th>Số lượng</th>
              <th>Safety Stock</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventories.map((inv) => (
              <tr key={inv.inventoryId}>
                <td>{inv.inventoryId}</td>
                <td>{inv.variantId}</td>
                <td>{inv.quantity}</td>
                <td>{inv.safetyStock}</td>
                <td>{inv.updatedAt}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={loading}
                    onClick={() => handleUpdateClick(inv)}
                  >
                    Cập nhật
                  </Button>{" "}
                  <Button
                    variant="success"
                    size="sm"
                    disabled={loading}
                    onClick={() => handleTransactionClick(inv.variantId)}
                  >
                    Nhập/Xuất
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Bảng lịch sử giao dịch */}
      <h2 className="">Lịch sử giao dịch</h2>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Variant ID</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Nguồn</th>
              <th>Ngày giao dịch</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tran) => (
              <tr key={tran.transactionId}>
                <td>{tran.transactionId}</td>
                <td>{tran.variantId}</td>
                <td>{transactionTypeVN[tran.transactionType]}</td>
                <td>{tran.quantity}</td>
                <td>{tran.unitCost}</td>
                <td>{transactionSourceVN[tran.transactionSource]}</td>
                <td>{tran.transactionDate}</td>
                <td>{tran.note}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal cập nhật tồn kho */}
      <UpdateInventoryModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        inventory={selectedInventory}
        onSubmit={handleUpdateSubmit}
        onChange={setSelectedInventory}
      />

      {/* Modal giao dịch */}
      <TransactionModal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        payload={transactionPayload}
        onChange={setTransactionPayload}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
};

export default InventoryManagement;
