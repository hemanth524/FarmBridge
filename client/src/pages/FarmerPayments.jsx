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
    <div className="min-h-screen bg-gray-500   p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Farmer Payments
        </h2>

        {produceList.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
            <p>No sold produce yet.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {produceList.map((produce) => (
              <div className=" shadow-lg  hover:shadow-black/80">
              <li
                key={produce._id}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
              >
                <div className="text-gray-800 ">
                  <div className="mb-1">
                    <span className="font-medium">Crop:</span> {produce.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Buyer:</span>{" "}
                    {produce.paidBy?.name || "Not paid"}
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
                  {produce.paymentDetails?.paymentDate && (
                    <div className="mb-1">
                      <span className="font-medium">Paid On:</span>{" "}
                      {new Date(produce.paymentDetails.paymentDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
