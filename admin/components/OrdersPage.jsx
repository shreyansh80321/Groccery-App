import React, { useEffect } from "react";
import { ordersPageStyles as styles } from "../src/assets/adminStyles";
import { useState } from "react";
import { FiCheck, FiPackage, FiTruck } from "react-icons/fi";
import { BsCurrencyRupee } from "react-icons/bs";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/orders");
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.customer.phone.includes(term) ||
          (order.customer.email &&
            order.customer.email.toLowerCase().includes(term))
      );
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>Order Management</h1>
          <p className={styles.headerSubtitle}>
            View, manage, and track customer orders
          </p>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statsCard("border-blue-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg:blue-100")}>
                <FiPackage className={styles.statsCardIcon("text-blue-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Track Orders</p>
                <p className={styles.statsCardValue}>{orders.length}</p>
              </div>
            </div>
          </div>
          <div className={styles.statsCard("border-blue-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg:amber-100")}>
                <FiTruck className={styles.statsCardIcon("text-amber-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Processing</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.status === "Processing").length}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.statsCard("border-blue-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg:emerald-100")}>
                <FiCheck className={styles.statsCardIcon("text-emerald-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Delivered</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.status === "Delivered").length}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.statsCard("border-red-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg:red-100")}>
                <BsCurrencyRupee
                  className={styles.statsCardIcon("text-red-600")}
                />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Pending Payment</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.paymentStatus === "Unpaid").length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeaderCell}>Order ID</th>
                  <th className={styles.tableHeaderCell}>Customer</th>
                  <th className={styles.tableHeaderCell}>Date</th>
                  <th className={styles.tableHeaderCell}>Items</th>
                  <th className={styles.tableHeaderCell}>Total</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Payment</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <body className={styles.tableBody}></body>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
