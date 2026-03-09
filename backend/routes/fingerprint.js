const express = require('express');
const router = express.Router();
const Fingerprint = require('../models/Fingerprint');
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const User = require("../models/User");

// @route   POST /api/fingerprint/save
// @desc    Save or update fingerprint data for a user
// @access  Public (should be protected in production)


router.post('/api/fingerprint/save', async (req, res) => {
  try {
    const { userId, main } = req.body;

    console.log("Main data:", main ? Object.keys(main) : "No main data");

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!main) {
      return res.status(400).json({ success: false, message: "Fingerprint data (main) is required" });
    }

    // ==============================
    // 1️⃣ SAVE IN MONGODB (AS YOU ALREADY DO)
    // ==============================
    const savedFingerprint = await Fingerprint.findOneAndUpdate(
      { userId: userId },   // ✅ use userId
      { $set: { main: main } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ==============================
    // 2️⃣ FETCH USER DETAILS
    // ==============================
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ==============================
    // 3️⃣ CREATE UPLOAD FOLDER
    // ==============================
    
    
  const uploadsDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Username folder
  const userFolder = path.join(uploadsDir, user.username);

  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder);
  }

  // Left & Right folders
  const leftFolder = path.join(userFolder, "left");
  const rightFolder = path.join(userFolder, "right");

  if (!fs.existsSync(leftFolder)) {
    fs.mkdirSync(leftFolder);
  }

  if (!fs.existsSync(rightFolder)) {
    fs.mkdirSync(rightFolder);
  }

  Object.keys(main).forEach((hand) => {

  const handFolder = hand.toLowerCase() === "left" ? leftFolder : rightFolder;

  main[hand].fingers.forEach((finger) => {

    Object.keys(finger.sides).forEach((side) => {
      const imageData = finger.sides[side];

      if (!imageData || !imageData.startsWith("data:image")) return;

      const base64Data = imageData.split(",")[1];
      const imgBuffer = Buffer.from(base64Data, "base64");

      const fileName = `${finger.name}_${side}.png`;
      const imagePath = path.join(handFolder, fileName);

      fs.writeFileSync(imagePath, imgBuffer);
    });

  });

});
const pdfPath = path.join(userFolder, `${user.username}_fingerprint_report.pdf`);

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(pdfPath));

    // ==============================
    // 4️⃣ HEADER SECTION
    // ==============================
    doc
      .fontSize(22)
      .text("Fingerprint Report", { align: "center" })
      .moveDown();

    doc
      .fontSize(14)
      .text(`Name: ${user.username}`)
      .text(`Email: ${user.email}`)
      .text(`Phone: ${user.phonenumber}`)
      .text(`Address: ${user.address}`)
      .text(`Generated On: ${new Date().toLocaleString()}`)
      .moveDown(2);
    
    // ==============================
    // 5️⃣ LOOP THROUGH HANDS & FINGERS
    // ==============================
    Object.keys(main).forEach((hand) => {

  main[hand].fingers.forEach((finger) => {

    doc.addPage(); // One page per finger

    // =============================
    // HEADER
    // =============================
    doc
      .fontSize(20)
      .text("Fingerprint Report", { align: "center" })
      .moveDown();

    doc
      .fontSize(16)
      .text(`Hand: ${hand.toUpperCase()}`, { align: "center" })
      .text(`Finger: ${finger.name}`, { align: "center" })
      .moveDown(2);

    let yPosition = 180;

["left", "center", "right"].forEach((side) => {

  const imageData = finger.sides[side];

  if (!imageData || !imageData.startsWith("data:image")) return;

  const base64Data = imageData.split(",")[1];
  const imgBuffer = Buffer.from(base64Data, "base64");

  doc
    .fontSize(16)
    .text(side.toUpperCase(), 0, yPosition, {
      align: "center"
    });

  yPosition += 30;

  doc.image(imgBuffer, {
    width: 780,
    // height: 250,
    align: "center"
  });

  yPosition += 320; // adjust spacing
});

  });

});

    doc.end();

    // PDF file puri tarah banne ka intezar karein, fir download bhejein
    const stream = fs.createReadStream(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${user.username}_report.pdf`);
    stream.pipe(res);

    // ==============================
    // 6️⃣ RESPONSE
    // ==============================
    res.status(200).json({
      success: true,
      message: "Fingerprint saved & PDF generated successfully ✅",
      pdf: `${userId}_fingerprint_report.pdf`
    });

  } catch (error) {
  console.error("FULL ERROR:", error);
  console.error("STACK:", error.stack);

  res.status(500).json({
    success: false,
    message: error.message
  });
}
});


router.get('/api/fingerprint/:userId', async (req, res) => {
  try {
    const fingerprint = await Fingerprint.findOne({ userId: req.params.userId });

    if (!fingerprint) {
      return res.status(404).json({ success: false, message: "Fingerprint data not found" });
    }

    res.status(200).json({ success: true, data: fingerprint });
  } catch (error) {
    console.error("Error fetching fingerprint data:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});


module.exports = router;
