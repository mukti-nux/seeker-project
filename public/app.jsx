import React, { useState, useEffect } from "react";
import SquareProgressBar from "./SquareProgressBar";

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <SquareProgressBar progress={progress} />
    </div>
  );
}
