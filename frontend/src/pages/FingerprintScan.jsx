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

 // Function ko 'freshData' accept karne ke liye badlein
const saveToDatabase = async (freshData) => { 
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      alert("Please login first ❌");
      return;
    }

    const user = JSON.parse(storedUser);

    // Debug: Check karein ki images hain ya nahi
    console.log("Sending data to server:", freshData);

    const response = await axios.post(
      'https://fingerscan-4.onrender.com/api/fingerprint/save', 
      {
        userId: user._id,
        main: freshData // 👈 State ki jagah freshData bhejien
      },
      { responseType: 'blob' } 
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.username}_Fingerprint_Report.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Saved & PDF Downloaded Successfully ✅");

  } catch (error) {
    console.error("Error saving:", error);
    alert("Error saving data.");
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

      // 1. Naya data object banayein purane data se
      const updatedFingerData = { ...fingerData };
      let fingerArray = [...updatedFingerData[handType].fingers];

      let fingerObj = fingerArray.find(f => f.name === fingerName);

      if (!fingerObj) {
        fingerObj = { name: fingerName, sides: {} };
        fingerArray.push(fingerObj);
      }

      fingerObj.sides[currentSide] = imageSrc;
      updatedFingerData[handType].fingers = fingerArray;

      // 2. State update karein (Next time ke liye)
      setFingerData(updatedFingerData);

      // 3. Logic for Next Step
      if (currentSideIndex < sides.length - 1) {
        setCurrentSideIndex((prev) => prev + 1);
      } else {
        setCompletedSides([]);
        setCurrentSideIndex(0);

        if (currentFingerIndex < 9) {
          setCurrentFingerIndex((prev) => prev + 1);
        } else {
          // 🚀 AAKHRI STEP: Updated data ko directly bhejien
          saveToDatabase(updatedFingerData); 
        }
      }
    }
  }
};

  return (
    <div className="container handscan">
      {/* 1. MAIN CAMERA - MUST BE UNCOMMENTED FOR REF TO WORK */}
      {/* <div className="camera">
      {isCameraActive && (
        <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg" // PNG ki jagah JPEG use karein, wo size mein choti hoti hai
        screenshotQuality={0.8} 
        videoConstraints={{ width: 640, height: 480 }}
      />
      )}
    </div> */}

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
