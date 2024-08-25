const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route"); 
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route"); 
const mongodb = require("./db/mongodb");
const path = require("path");
const cleanUnusedAvatarImages = require("./utils/cleanUnusedAvatarImages");
const cors = require("cors");
const app = express();
  
mongodb.connect();

setInterval(() => {
  cleanUnusedAvatarImages();
}, 43200000); // * Delete unused avatar files every 12 hours

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.static(path.join(__dirname, "./uploads")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter)

app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; 
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));