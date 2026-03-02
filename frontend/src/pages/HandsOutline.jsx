import { useState, useEffect } from "react";
import leftHand from "../assets/left hand.jpg";
import rightHand from "../assets/right hand.jpg";
import "./style.css";


const IMG_WIDTH = 400;
const IMG_HEIGHT = 500;
// LEFT hand finger positions (Thumb → Little)
const leftHandPositions = [
  { top: `${(265 / IMG_HEIGHT) * 100}%`, left: `${(310 / IMG_WIDTH) * 100}%` }, // Thumb
  { top: `${(95 / IMG_HEIGHT) * 100}%`,  left: `${(245 / IMG_WIDTH) * 100}%` }, // Index
  { top: `${(65 / IMG_HEIGHT) * 100}%`,  left: `${(182 / IMG_WIDTH) * 100}%` }, // Middle
  { top: `${(85 / IMG_HEIGHT) * 100}%`,  left: `${(123 / IMG_WIDTH) * 100}%` }, // Ring
  { top: `${(144 / IMG_HEIGHT) * 100}%`, left: `${(80 / IMG_WIDTH) * 100}%` }   // Little
];

// RIGHT hand finger positions (Thumb → Little)
const rightHandPositions = [
  { top: `${(212 / IMG_HEIGHT) * 100}%`, left: `${(79 / IMG_WIDTH) * 100}%` },
  { top: `${(90 / IMG_HEIGHT) * 100}%`,  left: `${(142 / IMG_WIDTH) * 100}%` },
  { top: `${(65 / IMG_HEIGHT) * 100}%`,  left: `${(205 / IMG_WIDTH) * 100}%` },
  { top: `${(88 / IMG_HEIGHT) * 100}%`,  left: `${(263 / IMG_WIDTH) * 100}%` },
  { top: `${(145 / IMG_HEIGHT) * 100}%`, left: `${(307 / IMG_WIDTH) * 100}%` }
];

const HandsOutline = ({ captureTrigger }) => {
  const [hand, setHand] = useState("left");
  const [fingerIndex, setFingerIndex] = useState(0);

  const [scannedLeft, setScannedLeft] = useState([]);
  const [scannedRight, setScannedRight] = useState([]);
  const [sideCount, setSideCount] = useState(0); 

  // useEffect(() => {
  //   if (hand === "left") {
  //     // Save current left finger
  //     setScannedLeft(prev => [...prev, leftHandPositions[fingerIndex]]);

  //     if (fingerIndex < leftHandPositions.length - 1) {
  //       setFingerIndex(fingerIndex + 1);
  //     } else {
  //       setHand("right");
  //       setFingerIndex(0);
  //     }
  //   } else {
  //     // Save current right finger
  //     setScannedRight(prev => [...prev, rightHandPositions[fingerIndex]]);

  //     if (fingerIndex < rightHandPositions.length - 1) {
  //       setFingerIndex(fingerIndex + 1);
  //     } else {
  //       // Reset cycle
  //       setHand("left");
  //       setFingerIndex(0);
  //       setScannedLeft([]);
  //       setScannedRight([]);
  //     }
  //   }
  // }, [captureTrigger]);


  useEffect(() => {
  if (!captureTrigger) return;

  // Increase side count first
  if (sideCount < 2) {
    setSideCount(prev => prev + 1);
    return; // Stop here until 3 sides done
  }

  // After 3 sides → reset sideCount
  setSideCount(0);

  if (hand === "left") {
    setScannedLeft(prev => [...prev, leftHandPositions[fingerIndex]]);

    if (fingerIndex < leftHandPositions.length - 1) {
      setFingerIndex(prev => prev + 1);
    } else {
      setHand("right");
      setFingerIndex(0);
    }

  } else {
    setScannedRight(prev => [...prev, rightHandPositions[fingerIndex]]);

    if (fingerIndex < rightHandPositions.length - 1) {
      setFingerIndex(prev => prev + 1);
    } else {
      alert("All 10 Fingers Completed ✅");
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