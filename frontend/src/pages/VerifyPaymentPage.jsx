import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { replace, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyPaymentPage = () => {
  const [statusMsg, setStatusMsg] = useState("Verifying Payment...");
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const session_id = params.get("session_id");
    const payment_status = params.get("payment_status");
    const token = localStorage.getItem("authToken");
    if (payment_status === "cancel") {
      navigate("/checkout", { replace: true });
      return;
    }
    if (!session_id) {
      setStatusMsg("No Session id provided");
      return;
    }
    axios
      .get("https://groccery-app-frontend.onrender.com/api/orders/confirm", {
        params: { session_id },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(() => {
        clearCart();
        navigate("/myorders", { replace: true });
      })
      .catch((err) => {
        console.error("Confirmation error:", err);
        setStatusMsg("There was an error confirming your payment");
      });
  }, [search, clearCart, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;
