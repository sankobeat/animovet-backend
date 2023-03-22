const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectdb } = require("./db/connectdb");
dotenv.config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const reservationRouter = require("./routes/reservationRoute");
const userRoute = require("./routes/userRoute");
const messagesRoute = require("./routes/messagesRoutes");
const adminRoute = require("./routes/adminRoutes");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { notFound, errorHandler } = require("./middleware/errorHandler");
const User = require("./models/userModel");
app.use(express.json());
app.use(cors());
app.use("/api/reservation", reservationRouter);
app.use("/api/user", userRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/admin", adminRoute);
connectdb();
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

let activeAdmins = [];

io.on("connection", (socket) => {
  socket.on("addAdmin", (userId) => {
    if (!activeAdmins.some((admin) => admin.userId === userId)) {
      activeAdmins.push({ userId, socketId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    activeAdmins = activeAdmins.filter((admin) => admin.socketId !== socket.id);
  });

  socket.on("userRegister", async (data) => {
    activeAdmins.forEach((admin) => {
      io.to(admin.socketId).emit("userHasRegistered", data);
    });
  });
});
