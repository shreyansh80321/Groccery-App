import React from "react";
import { listItemsPageStyles as styles } from "../src/assets/adminStyles";
import { FiFilter, FiPackage, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { itemsHomeStyles } from "../../frontend/src/assets/dummyStyles";
import { useEffect } from "react";
import axios from "axios";

const StatsCard = ({ icon: Icon, color, border, label, value }) => (
  <div className={styles.statsCard(border)}>
    <div className={styles.statsCardInner}>
      <div className={styles.statsCardIconContainer(color)}>
        <Icon className={styles.statsCardIcon(color)} />
      </div>
      <div>
        <p className={styles.statsCardLabel}>{label}</p>
        <p className={styles.statsCardValue}>{value}</p>
      </div>
    </div>
  </div>
);

const ListItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/items");
        const data = response.data;
        const withUrls = data.map((item) => ({
          ...item,
          imageUrl: item.imageUrl
            ? `http://localhost:4000${item.imageUrl}`
            : null,
        }));
        const itemCategories = data.map((item) => item.category);
        const uniqueCategories = ["All", ...new Set(itemCategories)];
        setCategories(uniqueCategories);
        setItems(withUrls);
        setFilteredItems(withUrls);
      } catch (err) {
        console.error("Failed to load items:", err);
        alert("Could not load products. See console for errors");
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.category == selectedCategory)
      );
    }
  }, [selectedCategory, items]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setFilteredItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Deleted failed", err.response?.status, err.response?.data);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>Product Inventory</h1>
          <p className={styles.headerSubtitle}>Manage your product listings</p>
        </div>
        <div className={styles.statsGrid}>
          <StatsCard
            icon={FiPackage}
            color="bg-emerald-100"
            border="border-emerald-500"
            label="Total Products"
            value={items.length}
          />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.headerFlex}>
            <h2 className={styles.headerTitleSmall}>
              Products({filteredItems.length})
              {selectedCategory !== "All" && `in ${selectedCategory}`}
            </h2>
            <div className={styles.filterContainer}>
              <div className={styles.filterSelectContainer}>
                <div className={styles.filterIconContainer}>
                  <FiFilter className={styles.filterIcon} />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className={styles.filterSelectArrow}>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateIconContainer}>
                <FiPackage className={styles.emptyStateIcon} />
              </div>
              <h3 className={styles.emptyStateTitle}>No Products Found</h3>
              <p className={styles.emptyStateText}>
                {selectedCategory === "All"
                  ? "Try adding a new product"
                  : `No product in ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Product</th>
                    <th className={styles.tableHeaderCell}>Category</th>
                    <th className={styles.tableHeaderCell}>Price</th>
                    <th className={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className={styles.tableRowHover}>
                      <td className={styles.tableDataCell}>
                        <div className={styles.productCell}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className={styles.productImage}
                            />
                          ) : (
                            <div className={styles.placeholderImage} />
                          )}
                          <div>
                            <div className={styles.productName}>
                              {item.name}
                            </div>
                            <div className={styles.productDescription}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableDataCell}>
                        <span className={styles.categoryText}>
                          {item.category}
                        </span>
                      </td>
                      <td className={styles.tableDataCell}>
                        <div className={styles.price}>
                          ₹{item.price.toFixed(2)}
                        </div>
                        {item.oldPrice > item.price && (
                          <div className={styles.oldPrice}>
                            ₹{item.oldPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className={styles.tableDataCell}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className={styles.deleteButton}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListItemsPage;
