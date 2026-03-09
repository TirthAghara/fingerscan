const express = require('express');
const router = express.Router();
const Fingerprint = require('../models/Fingerprint');
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const User = require("../models/User");

// ✅ FIX 1: Path ko sirf '/save' rakhein (Double prefix hatayein)
router.post('/save', async (req, res) => {
  try {
    const { userId, main } = req.body;

    if (!userId || !main) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // 1️⃣ MongoDB Update
    await Fingerprint.findOneAndUpdate(
      { userId: userId },
      { $set: { main: main } },
      { new: true, upsert: true }
    );

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Folder Setup
    const uploadsDir = path.join(__dirname, "../uploads");
    const userFolder = path.join(uploadsDir, user.username);
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

    // 3️⃣ PDF Generation
    const pdfPath = path.join(userFolder, `${user.username}_report.pdf`);
    const doc = new PDFDocument();
    
    // WriteStream setup
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // ==============================
// 5️⃣ LOOP THROUGH HANDS & FINGERS
// ==============================
Object.keys(main).forEach((hand) => {
  main[hand].fingers.forEach((finger) => {
    
    // Har finger ke liye naya page
    doc.addPage(); 

    doc.fontSize(22).fillColor("blue").text(`HAND: ${hand.toUpperCase()}`, { align: "center" });
    doc.fontSize(18).fillColor("black").text(`Finger: ${finger.name}`, { align: "center" }).moveDown(1);

    // X aur Y coordinates control karne ke liye
    let currentY = 120; 

    ["left", "center", "right"].forEach((side) => {
      const imageData = finger.sides[side];

      // Debug: Check karein ki image data empty toh nahi hai
      console.log(`Checking image for ${hand} ${finger.name} ${side}:`, imageData ? imageData.length : "EMPTY");

      if (imageData && imageData.startsWith("data:image")) {
        try {
          const base64Data = imageData.split(",")[1];
          const imgBuffer = Buffer.from(base64Data, "base64");

          doc.fontSize(12).text(side.toUpperCase(), 50, currentY);
          
          // ✅ Image ko page ke beech mein fit karein
          doc.image(imgBuffer, 50, currentY + 15, {
            fit: [500, 180], // Max width 500, Max height 180
            align: 'center'
          });

          currentY += 210; // Agli image ke liye gap
        } catch (err) {
          console.error("PDF Image Error:", err.message);
        }
      } else {
        doc.fillColor("red").text(`[No image captured for ${side}]`, 50, currentY);
        currentY += 40;
      }
    });
  });
});

doc.end();

    doc.fontSize(22).text("Fingerprint Report", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Name: ${user.username}`).text(`Email: ${user.email}`).moveDown();

    // Finger data loop... (Aapka purana loop yahan rahega)
    Object.keys(main).forEach((hand) => {
      main[hand].fingers.forEach((finger) => {
        doc.addPage().fontSize(16).text(`Hand: ${hand.toUpperCase()} - ${finger.name}`, { align: "center" });
        // Images logic...
      });
    });

    doc.end();

    // ✅ FIX 2: PDF likhne ka intezar karein, fir stream karein
    writeStream.on('finish', () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${user.username}_report.pdf`);
      
      const readStream = fs.createReadStream(pdfPath);
      readStream.pipe(res);
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ FIX 3: Path ko sirf '/:userId' rakhein
router.get('/:userId', async (req, res) => {
  try {
    const fingerprint = await Fingerprint.findOne({ userId: req.params.userId });
    if (!fingerprint) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: fingerprint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;