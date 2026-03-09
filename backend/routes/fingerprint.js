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
    
    // 🔍 LOG 1: Check karein ki data aaya ya nahi
    console.log("--- New Save Request ---");
    console.log("User ID:", userId);
    console.log("Hands in data:", main ? Object.keys(main) : "NULL");

    if (!main) return res.status(400).send("No data received");

    const user = await User.findById(userId);
    const pdfPath = path.join(__dirname, "../", `${user.username}_report.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(25).text("FINGERPRINT REPORT", { align: "center" }).moveDown();

    // Loop through Hands (Left/Right)
    for (const hand of Object.keys(main)) {
      for (const finger of main[hand].fingers) {
        doc.addPage();
        doc.fontSize(20).text(`${hand.toUpperCase()} - ${finger.name}`, { align: "center" }).moveDown();

        for (const side of ["left", "center", "right"]) {
          const imageData = finger.sides[side];

          if (imageData && imageData.includes("data:image")) {
            console.log(`✅ Image found for ${finger.name} (${side})`); // 🔍 LOG 2
            
            const base64Data = imageData.split(",")[1];
            const imgBuffer = Buffer.from(base64Data, "base64");

            doc.fontSize(12).text(side.toUpperCase(), { align: "center" });
            
            // Image placement
            doc.image(imgBuffer, {
              fit: [450, 200], // Page width se chota rakha hai
              align: 'center'
            });
            doc.moveDown(12);
          } else {
            console.log(`❌ No image for ${finger.name} (${side})`); // 🔍 LOG 3
            doc.text(`[No ${side} image captured]`, { align: "center" }).moveDown();
          }
        }
      }
    }

    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath);
    });

  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).send(error.message);
  }
});

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