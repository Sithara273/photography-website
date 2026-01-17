const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 FIXED ADMIN EMAIL
const ADMIN_EMAIL = "sitharasanthosh273@gmail.com";

// API to check admin
app.post("/check-admin", (req, res) => {
  const { email } = req.body;

  if (email === ADMIN_EMAIL) {
    res.json({ admin: true });
  } else {
    res.json({ admin: false });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
