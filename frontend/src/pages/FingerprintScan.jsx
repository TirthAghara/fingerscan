import { useState } from "react";
import HandsOutline from "./HandsOutline";
import "./style.css";

const SidePanel = ({ onCapture }) => (
  <div className="panel">
    <div className="button-row">
      <button>Left</button>
      <button>Center</button>
      <button>Right</button>
    </div>

    <div className="blank-box">Output</div>

    {/* CAPTURE BUTTON */}
    <button className="capture-btn" onClick={onCapture}>
      Capture
    </button>
  </div>
);

const FingerprintScan = () => {
  const [captureCount, setCaptureCount] = useState(0);

  const handleCapture = () => {
    setCaptureCount((prev) => prev + 1);
  };

  return (
    <div className="container">
      {/* HANDS */}
      <div className="hands">
        <HandsOutline captureTrigger={captureCount} />
      </div>

      {/* SIDE PANEL */}
      <SidePanel onCapture={handleCapture} />
    </div>
  );
};

export default FingerprintScan;
