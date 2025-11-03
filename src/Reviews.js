import React from "react";

const Reviews = () => {
  return (
    <div className="relative z-20 py-20 bg-yellow-50 flex justify-center items-center">
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full px-6">

        {/* Review 1 */}
        <div className="bg-yellow-200 bg-opacity-30 backdrop-blur-md rounded-xl p-8 text-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]">
          <div className="flex justify-center mb-3 text-yellow-500 text-2xl">
            ⭐⭐⭐⭐☆
          </div>
          <p className="text-gray-800 italic">
            "Really fresh and healthy plants. Delivery was quick too!"
          </p>
          <p className="mt-2 text-base text-gray-600 font-medium">
            – Ramesh Kumar
          </p>
        </div>

        {/* Review 2 */}
        <div className="bg-yellow-200 bg-opacity-30 backdrop-blur-md rounded-xl p-8 text-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]">
          <div className="flex justify-center mb-3 text-yellow-500 text-2xl">
            ⭐⭐⭐⭐⭐
          </div>
          <p className="text-gray-800 italic">
            "Absolutely loved the quality. Will definitely order again."
          </p>
          <p className="mt-2 text-base text-gray-600 font-medium">
            – Priya Sharma
          </p>
        </div>

        {/* Review 3 */}
        <div className="bg-yellow-200 bg-opacity-30 backdrop-blur-md rounded-xl p-8 text-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]">
          <div className="flex justify-center mb-3 text-yellow-500 text-2xl">
            ⭐⭐⭐⭐☆
          </div>
          <p className="text-gray-800 italic">
            "Great experience overall. Customer support was very helpful."
          </p>
          <p className="mt-2 text-base text-gray-600 font-medium">
            – Aarav Mehta
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
