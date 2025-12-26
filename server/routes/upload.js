import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

// store file in memory (DO NOT save to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, mimetype, originalname } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } 
    else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } 
    else if (mimetype === "text/plain") {
      extractedText = buffer.toString("utf-8");
    } 
    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // safety limit
    extractedText = extractedText.slice(0, 6000);

    res.json({
      filename: originalname,
      text: extractedText
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
