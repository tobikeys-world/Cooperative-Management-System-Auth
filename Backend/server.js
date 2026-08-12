const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// express server
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

//routes
const memberRoutes = require("./routes/members");
app.use("/api", memberRoutes);

const contributionRoutes = require("./routes/contributions");
app.use("/api", contributionRoutes);

const loanRoutes = require("./routes/loans");
app.use("/api", loanRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api", dashboardRoutes);

const reportRoutes = require("./routes/report");
app.use("/api/reports", reportRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Cooperative app API is running!");
})

//server
app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
});