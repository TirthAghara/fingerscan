const express = require('express');
const router = express.Router();
const Fingerprint = require('../models/Fingerprint');
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const User = require("../models/User");

router.post('/save', async (req, res) => {
  try {
    const { userId, main } = req.body;

    if (!userId || !main) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ PDF Document yahan define karein
    const doc = new PDFDocument({ margin: 30, size: 'A4' }); 
    
    // 2️⃣ File path setup
    const pdfPath = path.join(__dirname, "../../", `${user.username}_report.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // 3️⃣ Ab aap doc use kar sakte hain (Line 71 fix)
    doc
      .fontSize(22)
      .text("Fingerprint Report", { align: "center" })
      .moveDown();

    doc
      .fontSize(14)
      .text(`Name: ${user.username}`)
      .text(`Email: ${user.email}`)
      .moveDown(2);

    // ==============================
    // 4️⃣ IMAGES LOOP (Jo humne discuss kiya tha)
    // ==============================
    Object.keys(main).forEach((hand) => {
      main[hand].fingers.forEach((finger) => {
        doc.addPage();
        doc.fontSize(20).text(`${hand.toUpperCase()} - ${finger.name}`, { align: "center" }).moveDown();

        ["left", "center", "right"].forEach((side) => {
          const imageData = finger.sides[side];
          if (imageData && imageData.includes("data:image")) {
            const base64Data = imageData.split(",")[1];
            const imgBuffer = Buffer.from(base64Data, "base64");

            doc.fontSize(12).text(side.toUpperCase(), { align: "center" });
            doc.image(imgBuffer, {
              fit: [500, 200],
              align: 'center'
            });
            doc.moveDown(12);
          }
        });
      });
    });

    // 5️⃣ PDF Khatam karein
    doc.end();

    // 6️⃣ Stream hone ka wait karein aur fir download bhejein
    writeStream.on('finish', () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${user.username}_report.pdf`);
      fs.createReadStream(pdfPath).pipe(res);
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ROUTE
router.get('/:userId', async (req, res) => {
  try {
    const fingerprint = await Fingerprint.findOne({ userId: req.params.userId });
    res.status(200).json({ success: true, data: fingerprint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
