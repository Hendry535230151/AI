require("dotenv").config();
const db = require("./app/config/db");
const userRoute = require("./app/routes/userRoute");
const authRoute = require("./app/routes/authRoute");
const aiRoute = require("./app/routes/aiRoute");
const directoriesRoute = require("./app/routes/directoryRoute");
const categoryRoute = require("./app/routes/categoryRoute");
const fileRoute = require("./app/routes/fileRoute");
const downloadRoute = require("./app/routes/downloadRoute");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/ai", aiRoute);
app.use("/directories", directoriesRoute);
app.use("/categories", categoryRoute);
app.use("/files", fileRoute);
app.use("/download", downloadRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server run at http://localhost:${process.env.PORT}`);
});
