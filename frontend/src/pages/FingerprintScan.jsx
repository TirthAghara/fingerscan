// import { useState } from "react";
// import HandsOutline from "./HandsOutline";
// import "./style.css";
// import Sidebar from "../component/sidebar";

// const SidePanel = ({ onCapture }) => (
//   <div className="panel">
//     <Sidebar/>
//     <div className="button-row">
//       <button>Left</button>
//       <button>Center</button>
//       <button>Right</button>
//     </div>

//     <div className="blank-box">
//       Output
//     </div>

//     {/* CAPTURE BUTTON */}
//     <button className="capture-btn" onClick={onCapture}>
//       Capture
//     </button>
//   </div>
// );

// const FingerprintScan = () => {
//   const [captureCount, setCaptureCount] = useState(0);

//   const handleCapture = () => {
//     setCaptureCount((prev) => prev + 1);
//   };

//   return (
//     <div className="container">
//       {/* HANDS */}
//       <div className="hands">
//         <HandsOutline captureTrigger={captureCount} />
//       </div>

//       {/* SIDE PANEL */}
//       <SidePanel onCapture={handleCapture} />
//     </div>
//   );
// };


// export default FingerprintScan;





import { useState, useRef } from "react";
import Webcam from "react-webcam";
import HandsOutline from "./HandsOutline";
import "./Style.css";
import Sidebar from "../component/sidebar";
import axios from "axios";

const SidePanel = ({
  onCapture,
  capturedImage,
  isCameraActive,
  webcamRef,
  sides = [],
  currentSideIndex,
  completedSides = []
}) => (
  <div className="panel">
    
    <Sidebar />

    {/* SIDE BUTTONS */}
    <div className="button-row">
      {sides.map((side, index) => {
        let buttonClass = "";

        if (completedSides.includes(side)) {
          buttonClass = "completed";
        } else if (index === currentSideIndex) {
          buttonClass = "active";
        }

        return (
          <button
            key={side}
            className={buttonClass}
            disabled={index > currentSideIndex}
          >
            {side}
          </button>
        );
      })}
    </div>

    {/* CAMERA PREVIEW BOX */}
    
    <div className="blank-box">
  {capturedImage ? (
    <img
      src={capturedImage}
      alt="Captured"
      // style={{
      //   width: "100%",
      //   height: "100%",
      //   objectFit: "cover"
      // }}
    />
  ) : isCameraActive ? (
    <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat="image/jpeg"
      screenshotQuality={0.5}
      videoConstraints={{
        width: 320,
        height: 240,
        facingMode: "user"
      }}
    />
  ) : (
    <div className="camera-placeholder">
      Camera Preview
    </div>
  )}
</div>

    {/* CAPTURE BUTTON */}
    <button className="capture-btn" onClick={onCapture}>
      {capturedImage
        ? "Retake Screenshot"
        : isCameraActive
        ? "Take Screenshot"
        : "Start Camera"}
    </button>
  </div>
);

const storedUser = localStorage.getItem("user");

let user = null;

if (storedUser && storedUser !== "undefined") {
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user JSON:", error);
  }
}

console.log("User:", user);

const FingerprintScan = () => {
  
  // const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);

  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureCount, setCaptureCount] = useState(0);
  // const [currentFinger, setCurrentFinger] = useState("left");

  // const fingers = ["left", "center", "right"];

  const sides = ["Left", "Center", "Right"];
  const fingerNames = ["Thumb","Index","Middle","Ring","Little"];

  const [currentSideIndex, setCurrentSideIndex] = useState(0);
  const [currentFingerIndex, setCurrentFingerIndex] = useState(0);
  const [completedSides, setCompletedSides] = useState([]);
  const [fingerData, setFingerData] = useState({
  left: { fingers: [] },
  right: { fingers: [] }
});

// const handleCapture = () => {


//   if (capturedImage) {
//     setCapturedImage(null);
//     setIsCameraActive(true);
//     return;
//   }


//   if (!isCameraActive) {
//     setIsCameraActive(true);
//     return;
//   }


//   if (webcamRef.current) {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (imageSrc) {
//       setCapturedImage(imageSrc);
//       setCaptureCount((prev) => prev + 1);
//       setIsCameraActive(false); // Turn OFF camera
//     }
//   }
// };

  const saveToDatabase = async () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      alert("Please login first ❌");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user._id) {
      alert("Invalid user data ❌");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/fingerprint/save",
      {
        userId: user._id,
        main: fingerData
      }
    );

    alert("Saved Successfully ✅");

  } catch (error) {
    console.error("Error saving:", error);
  }
};


  const handleCapture = () => {

  if (capturedImage) {
    setCapturedImage(null);
    setIsCameraActive(true);
    return;
  }

  if (!isCameraActive) {
    setIsCameraActive(true);
    return;
  }

  if (webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();



    if (imageSrc) {
  setCapturedImage(imageSrc);
  setCaptureCount((prev) => prev + 1);
  setIsCameraActive(false);

  const currentSide = sides[currentSideIndex].toLowerCase();

  const handType = currentFingerIndex < 5 ? "left" : "right";
  const fingerIndex = currentFingerIndex % 5;
  const fingerName = fingerNames[fingerIndex];

  setFingerData((prev) => {
    const updated = { ...prev };

    let fingerArray = [...updated[handType].fingers];

    // Check if finger already exists
    let fingerObj = fingerArray.find(f => f.name === fingerName);

    if (!fingerObj) {
      fingerObj = {
        name: fingerName,
        sides: {}
      };
      fingerArray.push(fingerObj);
    }

    fingerObj.sides[currentSide] = imageSrc;

    updated[handType].fingers = fingerArray;

    return updated;
  });

  // Move to next side
  if (currentSideIndex < sides.length - 1) {
    setCurrentSideIndex((prev) => prev + 1);
  } else {
    setCompletedSides([]);
    setCurrentSideIndex(0);

    if (currentFingerIndex < 9) {
      setCurrentFingerIndex((prev) => prev + 1);
    } else {
      saveToDatabase();   // 👈 CALL SAVE FUNCTION
    }
  }
}
  }
};




  return (
    <div className="container handscan">
      {/* 1. MAIN CAMERA - MUST BE UNCOMMENTED FOR REF TO WORK */}
      <div className="camera">
      {isCameraActive && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          screenshotQuality={0.3}
          videoConstraints={{
            width: 320,
            height: 240
          }}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none"
          }}
        />
      )}
    </div>

      {/* 2. HANDS OVERLAY */}
      <div className="hands">
        <HandsOutline captureTrigger={captureCount} style={{margin: "0px"}} />
      </div>

      {/* 3. SIDE PANEL */}
      {/* <SidePanel 
        onCapture={handleCapture}
        capturedImage={capturedImage}
        isCameraActive={isCameraActive}
      /> */}

      <SidePanel
        onCapture={handleCapture}
        capturedImage={capturedImage}
        isCameraActive={isCameraActive}
        sides={sides}
        currentSideIndex={currentSideIndex} 
        completedSides={completedSides}  
         webcamRef={webcamRef}
      />
    </div>  
  );      
};

export default FingerprintScan;