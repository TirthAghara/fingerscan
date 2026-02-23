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
import "./style.css";
import Sidebar from "../component/sidebar";

const SidePanel = ({ onCapture, capturedImage, isCameraActive  }) => (
  <div className="panel">
    <Sidebar />

    <div className="button-row">
      <button>Left</button>
      <button>Center</button>
      <button>Right</button>
    </div>

    <div className="blank-box">
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : ( 
        /* Preview Webcam for UI - Ref is null here */
        <Webcam
          audio={false}
          ref={null} 
          screenshotFormat="image/jpeg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>

    {/* <button className="capture-btn" onClick={onCapture}>
      Capture
    </button> */}

    <button className="capture-btn" onClick={onCapture}>
  {capturedImage
    ? "Retake Screenshot"
    : isCameraActive
    ? "Take Screenshot"
    : "Start Camera"}
</button>
  </div>
);

const FingerprintScan = () => {
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureCount, setCaptureCount] = useState(0);


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
      setIsCameraActive(false); // Turn OFF camera
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
          screenshotFormat="image/jpeg"
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
      />                     */}
      <SidePanel 
        onCapture={handleCapture}
        capturedImage={capturedImage}
        isCameraActive={isCameraActive}
      />
    </div>  
  );      
};

export default FingerprintScan;
