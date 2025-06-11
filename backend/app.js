require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoutes = require("./src/routes/user.routes");
const scheduleRoutes = require("./src/routes/schedule.routes");
const contestRouter = require("./src/routes/contest.routes");
const friendRouter = require("./src/routes/friend.routes");
const bookmarkRouter = require("./src/routes/bookmark.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS 설정 (환경변수 + 기본값 합치기)
const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", userRoutes);
app.use("/", scheduleRoutes);
app.use("/", contestRouter);
app.use("/", friendRouter);
app.use("/", bookmarkRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
