import React, { useEffect } from "react";
import { ordersPageStyles } from "../assets/dummyStyles";
import axios from "axios";
import {
  FiArrowLeft,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData.email || "";
  const fetchAndFilterOrders = async () => {
    try {
      const resp = await axios.get(
        "https://groccery-app-backend.onrender.com/api/orders"
      );
      const allOrders = resp.data;
      const mine = allOrders.filter(
        (o) => o.customer?.email?.toLowerCase() === userEmail.toLowerCase()
      );
      setOrders(mine);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };
  useEffect(() => {
    fetchAndFilterOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.items.some((i) =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }, [orders, searchTerm]);
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };
  return (
    <div className={ordersPageStyles.page}>
      <div className={ordersPageStyles.container}>
        <div className={ordersPageStyles.header}>
          <a href="#" className={ordersPageStyles.backLink}>
            <FiArrowLeft className="mr-2" />
            Back to Account
          </a>
          <h1 className={ordersPageStyles.mainTitle}>
            My <span className={ordersPageStyles.titleSpan}>Orders</span>
          </h1>
          <p className={ordersPageStyles.subtitle}>
            View your order history and track orders
          </p>
          <div className={ordersPageStyles.titleDivider}>
            <div className={ordersPageStyles.dividerLine}></div>
          </div>
        </div>
        <div className={ordersPageStyles.searchContainer}>
          <div className={ordersPageStyles.searchForm}>
            <input
              type="text"
              placeholder="Search orders or products..."
              className={ordersPageStyles.searchInput}
              vlaue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={ordersPageStyles.searchButton}>
              <FiSearch size={18} />
            </button>
          </div>
        </div>
        <div className={ordersPageStyles.ordersTable}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={ordersPageStyles.tableHeader}>
                <tr>
                  <th className={ordersPageStyles.tableHeaderCell}>Order ID</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Date</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Items</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Total</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Status</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-700/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiPackage className="text-emerald-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-emerald-100 mb-1 ">
                          No orders found
                        </h3>
                        <p className="text-emerald-300">
                          Try adjusting your serach criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className={ordersPageStyles.tableRow}>
                      <td
                        className={`${ordersPageStyles.tableCell} font-medium text-emerald-200`}
                      >
                        {order.orderId || order._id}
                      </td>
                      <td className={`${ordersPageStyles.tableCell} text-sm`}>
                        {order.date}
                      </td>
                      <td className={ordersPageStyles.tableCell}>
                        <div className="text-emerald-100">
                          {order.items.length} items
                        </div>
                      </td>
                      <td
                        className={`${ordersPageStyles.tableCell} font-medium`}
                      >
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className={ordersPageStyles.tableCell}>
                        <span
                          className={`${ordersPageStyles.statusBadge} ${
                            order.status === "Delivered"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : order.status === "Processing"
                              ? "bg-amber-500/20 text-amber-200"
                              : order.status === "Shipped"
                              ? "bg-blue-500/20 text-blue-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className={ordersPageStyles.tableCell}>
                        <button
                          className={ordersPageStyles.actionButton}
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isDetailModalOpen && selectedOrder && (
        <div className={ordersPageStyles.modalOverlay}>
          <div className={ordersPageStyles.modalContainer}>
            <div className={ordersPageStyles.modalHeader}>
              <h2 className={ordersPageStyles.modalTitle}>
                Order Details: {selectedOrder._id}
              </h2>
              <button
                className={ordersPageStyles.modalCloseButton}
                onClick={closeModal}
              >
                <FiX size={22} />
              </button>

              <p className="text-green-300 mt-1">
                Ordered on {selectedOrder.date}
              </p>
            </div>
            <div className={ordersPageStyles.modalBody}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={ordersPageStyles.modalSection}>
                  <h3 className={ordersPageStyles.modalSectionTitle}>
                    <FiUser className="mr-2 text-emerald-300" />
                    My Information{" "}
                  </h3>
                  <div className={ordersPageStyles.modalCard}>
                    <div className="mb-3">
                      <div className="font-medium text-emerald-100">
                        {selectedOrder.customer.name}
                      </div>
                    </div>
                    <div className="text-emerald-300 flex items-center mt-2">
                      <FiMail className="mr-2 flex-shrink-0" />
                      {selectedOrder.customer.email || "No email found"}
                    </div>
                  </div>
                  <div className="text-emerald-300 flex items-center mt-2">
                    <FiPhone className="mr-2 flex-shrink-0" />
                    {selectedOrder.customer.phone}
                  </div>
                </div>
                <div className="flex items-start mt-3">
                  <FiMapPin className="text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                  <div className="text-emerald-300">
                    {selectedOrder.customer.address}
                  </div>
                </div>
              </div>
            </div>
            {selectedOrder.notes && (
              <div className={ordersPageStyles.modalSection}>
                <h3 className={ordersPageStyles.modalSectionTitle}>
                  Delivery Notes
                </h3>
                <div className="bg-emerald-800/50 border-1-4 border-emerald-400 p-4 rounded-lg">
                  <p className="text-emerald-200">{selectedOrder.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
