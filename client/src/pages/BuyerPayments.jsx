// src/pages/BuyerPayments.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BuyerPayments() {
  const [produceList, setProduceList] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5247/api/payments/buyer", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProduceList(data))
      .catch((err) => {
  console.error("❌ BuyerPayments fetch error:", err);
  toast.error("Failed to load your purchases");
});
  }, []);

  const openRazorpay = (produceId, amount) => {
    fetch("http://localhost:5247/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ produceId, amount }),
    })
      .then((res) => res.json())
      .then((order) => {
        const options = {
          key: "rzp_test_Z7kaXVsXt5WI6j", // ✅ use actual Razorpay key
          amount: order.amount,
          currency: "INR",
          order_id: order.id,
          handler: async function (response) {
            await fetch("http://localhost:5247/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                produceId,
              }),
            });
            toast.success("Payment successful");
            // refresh data
            const updated = await fetch("http://localhost:5247/api/payments/buyer", {
              headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());
            setProduceList(updated);
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch(() => toast.error("Payment initiation failed"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Buyer Payments</h2>
      {produceList.length === 0 ? (
        <p>No purchased produce found.</p>
      ) : (
        <ul className="space-y-4">
          {produceList.map((produce) => (
            <li
              key={produce._id}
              className="border p-4 rounded shadow bg-white space-y-1"
            >
              <div><strong>Crop:</strong> {produce.name}</div>
              <div><strong>Farmer:</strong> {produce.farmer?.name}</div>
              <div><strong>Amount:</strong> ₹{produce.price}</div>
              <div>
                <strong>Status:</strong>{" "}
                {produce.paymentStatus === "done" ? (
                  <span className="text-green-600">Done</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </div>
              {produce.paymentStatus === "pending" && (
                <button
                  onClick={() => openRazorpay(produce._id, produce.price)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Pay Now
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
