import React from "react";

const SquareProgressBar = ({ progress }) => {
  return (
    <div className="w-40 h-40 border-4 border-gray-300 relative">
      <div
        className="absolute bottom-0 left-0 bg-blue-500 h-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700">
        {progress}%
      </div>
    </div>
  );
};

export default SquareProgressBar;