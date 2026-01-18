const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ---------- STORAGE CONFIG ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const moduleName = req.params.module;
    const dir = path.join(__dirname, "uploads", moduleName);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- UPLOAD IMAGES ---------- */
app.post("/upload/:module", upload.array("images"), (req, res) => {
  res.json({ message: "Upload success" });
});

/* ---------- GET IMAGES ---------- */
app.get("/images/:module", (req, res) => {
  const moduleName = req.params.module;
  const dir = path.join(__dirname, "uploads", moduleName);

  if (!fs.existsSync(dir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(dir);
  res.json(files);
});

/* ---------- DELETE IMAGE ---------- */
app.delete("/delete/:module/:image", (req, res) => {
  const { module, image } = req.params;
  const filePath = path.join(__dirname, "uploads", module, image);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "Image deleted" });
  } else {
    res.status(404).json({ message: "Image not found" });
  }
});

/* ---------- SERVE IMAGES ---------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
