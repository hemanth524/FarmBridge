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
          key: "rzp_test_Z7kaXVsXt5WI6j",
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

            // Refresh data
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Buyer Payments
        </h2>

        {produceList.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
            <p>No purchased produce found.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {produceList.map((produce) => (
              <li
                key={produce._id}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
              >
                <div className="text-gray-800">
                  <div className="mb-1">
                    <span className="font-medium">Crop:</span> {produce.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Farmer:</span>{" "}
                    {produce.farmer?.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Amount:</span> ₹{produce.price}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    {produce.paymentStatus === "done" ? (
                      <span className="text-green-600 font-semibold">Done</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    )}
                  </div>

                  {produce.paymentStatus === "pending" && (
                    <button
                      onClick={() => openRazorpay(produce._id, produce.price)}
                      className="mt-4 px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
