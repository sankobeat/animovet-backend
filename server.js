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
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(express.json());
app.use(cors());
app.use("/api/reservation", reservationRouter);
app.use("/api/user", userRoute);
app.use("/api/messages", messagesRoute);
connectdb();
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
