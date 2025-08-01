// src/pages/FarmerPayments.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FarmerPayments() {
  const [produceList, setProduceList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5247/api/payments/farmer", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProduceList(data))
      .catch((err) => {
  console.error("❌ FarmerPayments fetch error:", err);
  toast.error("Failed to load sales");
});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Farmer Payments</h2>
      {produceList.length === 0 ? (
        <p>No sold produce yet.</p>
      ) : (
        <ul className="space-y-4">
          {produceList.map((produce) => (
            <li
              key={produce._id}
              className="border p-4 rounded shadow bg-white space-y-1"
            >
              <div><strong>Crop:</strong> {produce.name}</div>
              <div><strong>Buyer:</strong> {produce.paidBy?.name || "Not paid"}</div>
              <div><strong>Amount:</strong> ₹{produce.price}</div>
              <div>
                <strong>Status:</strong>{" "}
                {produce.paymentStatus === "done" ? (
                  <span className="text-green-600">Done</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </div>
              {produce.paymentDetails?.paymentDate && (
                <div>
                  <strong>Paid On:</strong>{" "}
                  {new Date(produce.paymentDetails.paymentDate).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
