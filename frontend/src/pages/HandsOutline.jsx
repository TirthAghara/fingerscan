import { useState, useEffect } from "react";
import leftHand from "../assets/left hand.jpg";
import rightHand from "../assets/right hand.jpg";
import "./style.css";

// LEFT hand finger positions (Thumb → Little)
const leftHandPositions = [
  { top: 210, left: 310 },
  { top: 210, left: 310 }, // Thumb
  { top: 95,  left: 245 }, // Index
  { top: 65,  left: 182 }, // Middle
  { top: 85,  left: 123 }, // Ring
  { top: 144, left: 80  }  // Little
];

// RIGHT hand finger positions (Thumb → Little)
const rightHandPositions = [
  { top: 212, left: 79  }, // Thumb
  { top: 90,  left: 142 }, // Index
  { top: 65,  left: 205 }, // Middle
  { top: 88,  left: 263 }, // Ring
  { top: 145, left: 307 }  // Little
];

const HandsOutline = ({ captureTrigger }) => {
  const [hand, setHand] = useState("left");
  const [fingerIndex, setFingerIndex] = useState(0);

  const [scannedLeft, setScannedLeft] = useState([]);
  const [scannedRight, setScannedRight] = useState([]);

  useEffect(() => {
    if (hand === "left") {
      // Save current left finger
      setScannedLeft(prev => [...prev, leftHandPositions[fingerIndex]]);

      if (fingerIndex < leftHandPositions.length - 1) {
        setFingerIndex(fingerIndex + 1);
      } else {
        setHand("right");
        setFingerIndex(0);
      }
    } else {
      // Save current right finger
      setScannedRight(prev => [...prev, rightHandPositions[fingerIndex]]);

      if (fingerIndex < rightHandPositions.length - 1) {
        setFingerIndex(fingerIndex + 1);
      } else {
        // Reset cycle
        setHand("left");
        setFingerIndex(0);
        setScannedLeft([]);
        setScannedRight([]);
      }
    }
  }, [captureTrigger]);

  return (  
       <div className="hands-wrapper">
      {/* LEFT HAND */}
      <div className="hand-container">
        <img src={leftHand} className="hand-img" alt="Left Hand" />

        {/* Saved dots */}
        {scannedLeft.map((pos, i) => (
          <span
            key={i}
            className="dot saved"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}

        {/* Active dot */}
        {hand === "left" && (
          <span
            className="dot active"
            style={{
              top: leftHandPositions[fingerIndex].top,
              left: leftHandPositions[fingerIndex].left
            }}
          />
        )}
      </div>

      {/* RIGHT HAND */}
      <div className="hand-container">
        <img src={rightHand} className="hand-img" alt="Right Hand" />

        {/* Saved dots */}
        {scannedRight.map((pos, i) => (
          <span
            key={i}
            className="dot saved"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}

        {/* Active dot */}
        {hand === "right" && (
          <span
            className="dot active"
            style={{
              top: rightHandPositions[fingerIndex].top,
              left: rightHandPositions[fingerIndex].left
            }}
          />
        )}
      </div>
    </div>
   
  );
};

export default HandsOutline;