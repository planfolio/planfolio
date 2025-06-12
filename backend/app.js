require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path         = require("path");
const userRoutes = require("./src/routes/user.routes");
const scheduleRoutes = require("./src/routes/schedule.routes");
const contestRouter = require("./src/routes/contest.routes");
const friendRouter = require("./src/routes/friend.routes");
const bookmarkRouter = require("./src/routes/bookmark.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
