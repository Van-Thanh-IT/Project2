import React, { useEffect, useState } from "react";
import {
  getAllInventory,
  updateInventory,
  getAllTransactions,
  createTransaction,
} from "../../services/InventoryService";
import { getAllProductVariants } from "../../services/productService";
import { getInfo } from "../../services/UserService";
import { getAllOrders } from "../../services/OrderService";
import { Table, Button, Spinner, Form, Tabs, Tab } from "react-bootstrap";
import UpdateInventoryModal from "../../components/modal/UpdateInventoryModal";
import TransactionModal from "../../components/modal/TransactionModal";
import { toast } from "react-toastify";
import "../../styles/global.scss";
import ExportCSV from "../../utils/exportCSV";
import { getAllUsers } from "../../services/UserService";
import TransactionDetailModal from "../../components/modal/TransactionDetailModal";


const InventoryManagement = () => {
  const [key, setKey] = useState("inventory");
  const [user, setUser] = useState([]);
  const [userList, setUserList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionPayload, setTransactionPayload] = useState({
    variantId: "",
    transactionType: "IMPORT",
    quantity: 0,
    unitCost: 0,
    transactionSource: "PURCHASE",
    referenceId: null,
    createdBy: user.userId,
    note: "",
  });

  const transactionTypeVN = { IMPORT: "Nhập", EXPORT: "Xuất" };
  const transactionSourceVN = {
    PURCHASE: "Mua hàng",
    SALE: "Bán hàng",
    RETURN: "Trả hàng",
    ADJUSTMENT: "Điều chỉnh",
  };

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getInfo();
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch dữ liệu tồn kho & giao dịch & variants
 const fetchData = async () => {
  setLoading(true);
  try {
    const [invRes, transRes, variantRes, orderRes, userRes] = await Promise.all([
      getAllInventory(),
      getAllTransactions(),
      getAllProductVariants(),
      getAllOrders(),
      getAllUsers(), // ✅ lấy danh sách tất cả user
    ]);

    setInventories(invRes?.data || []);
    setFilteredInventories(invRes?.data || []);
    setTransactions(transRes || []);
    setProductVariants(variantRes?.data || []);
    setOrders(orderRes?.data || []);
    setUserList(userRes?.data || []); // ✅ lưu danh sách user
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

  // Tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
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

  const handleViewDetail = (tran) => {
  setSelectedTransaction(tran);
  setShowDetailModal(true);
};


  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      await updateInventory(selectedInventory.inventoryId, selectedInventory);
      setShowUpdateModal(false);
      await fetchData();
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  //Nhập/Xuất tồn kho
  const handleTransactionClick = (variantId) => {
    setTransactionPayload({
      ...transactionPayload,
      variantId,
      createdBy: user.userId,
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
      const res = await createTransaction(transactionPayload);
      setShowTransactionModal(false);
      await fetchData();

      //tìm giao dịch vừa tạo (theo id hoặc match dữ liệu)
      const newTran = res?.data || transactions.find(
        t =>
          t.variantId === transactionPayload.variantId &&
          t.quantity === transactionPayload.quantity &&
          t.transactionType === transactionPayload.transactionType
      );

      if (newTran) {
        setSelectedTransaction(newTran);
        setShowDetailModal(true); //mở modal chi tiết ngay
      }

      toast.success(res?.messages || "Giao dịch thành công");
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
      <h2 className="text-center mb-2 page-title fw-bold">Quản lý tồn kho</h2>

      {/*Tabs Bootstrap */}
      <Tabs
        id="inventory-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        fill
      >
        {/* TAB 1: Tồn kho */}
        <Tab eventKey="inventory" title="Tồn kho">
          <div className="d-flex mb-3 justify-content-between">
            <Form.Control
              type="text"
              className="w-50"
              placeholder="🔍 Tìm kiếm Variant ID hoặc Mã kho..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="info"
              onClick={() => ExportCSV(filteredInventories, "tonkho.csv")}
            >
              ⬇️ Xuất File tồn kho
            </Button>
          </div>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table striped bordered hover responsive>
           <thead>
            <tr>
              <th>Mã kho</th>
              <th>Mã biến thể</th>
              <th>Màu sắc</th>
              <th>Tên sản phẩm</th>
              <th>Kích thước</th>
              <th>Trong lượng</th>
              <th>Số lượng</th>
              <th>Cảnh báo</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventories.map((inv) => {
              const variant = productVariants.find(v => v.variantId === inv.variantId);
              return (
                <tr key={inv.inventoryId}>
                  <td>{inv.inventoryId}</td>
                  <td>{inv.variantId}</td>
                  <td>{variant.color || "Không có"}</td>
                  <td>{variant.productName || "Không có"}</td>
                  <td>{variant.size || "Không có"}</td>
                  <td>{variant.weight  || "Không có"} kg</td>
                 <td>
                  {inv.quantity <= 0 
                    ? <span className="blink-red">hết hàng</span> 
                    : inv.quantity <= inv.safetyStock 
                      ? <span className="blink-red">Sắp hết hàng</span> 
                      : inv.quantity
                  }
                </td>

                  <td>{inv.safetyStock}</td>
                  <td>{inv.updatedAt}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateClick(inv)}
                    >
                     Sửa
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleTransactionClick(inv.variantId)}
                    >
                      Nhập/Xuất
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>

            </Table>
          </div>
        </Tab>

        {/* TAB 2: Lịch sử giao dịch */}
        <Tab eventKey="transactions" title="Lịch sử giao dịch">
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="warning"
              onClick={() => ExportCSV(transactions, "giaodich.csv")}
            >
              ⬇️ Xuất File giao dịch
            </Button>
          </div>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <Table striped bordered hover>
              <thead className="table-primary">
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Nguồn</th>
                  <th>Người nhập</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tran) => {

                  const variant = productVariants.find((v) => v.variantId === tran.variantId);

                  const createdUser = userList.find(u => u.userId === tran.createdBy);
                  
                  const role = createdUser.roles.some(r => r.roleName === "ADMIN") ? "Quản trị viên": "Khách hàng";

                  return (
                   <tr key={tran.transactionId}>
                      <td>{tran.transactionId}</td>
                      <td>{variant?.productName || "Không có"}</td>
                      <td>{transactionTypeVN[tran.transactionType]}</td>
                      <td>{tran.quantity}</td>
                      <td>{tran.unitCost}</td>
                      <td>{transactionSourceVN[tran.transactionSource]}</td>
                      <td>{role|| "Không rõ"}</td>
                      <td>{tran.note}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleViewDetail(tran)}
                        >
                          👁️ Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      {/*Modal cập nhật tồn kho */}
      <UpdateInventoryModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        inventory={selectedInventory}
        onSubmit={handleUpdateSubmit}
        onChange={setSelectedInventory}
      />

      {/*Modal giao dịch */}
      <TransactionModal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        payload={transactionPayload}
        onChange={setTransactionPayload}
        onSubmit={handleTransactionSubmit}
        variants={productVariants}
        orders={orders}
        inventories={inventories}
      />

     {/* modal xem chi tiết giao dịch */}
      <TransactionDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
        variant={productVariants.find(v => v.variantId === selectedTransaction?.variantId)}
        user={userList.find(u => u.userId === selectedTransaction?.createdBy)}
        order={orders.find(o => o.orderId === selectedTransaction?.referenceId)}
        transactionTypeVN={transactionTypeVN}
        transactionSourceVN={transactionSourceVN}
    />

    </div>
  );
};

export default InventoryManagement;
