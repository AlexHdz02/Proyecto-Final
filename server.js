const express = require("express");
const cors = require("cors");
const routes = require("./app/routes/api.routes");

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync({ force: false }).then(() => {
    console.log("Sync db.");
});

app.get("/", (req, res) => {
    res.json({ message: "Running Aplication" });
});

app.use(routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
