require("dotenv").config;
const express = require("express");
const path = require("path");
const session = require("express-session");

const bodyParser = require("body-parser"); 
const register_ROUTE = require("./routes/register_ROUTE");
const dashboard_ROUTE = require("./routes/dashboard_routes");
const admin_ROUTE = require("./routes/admin_ROUTE");

const app = express();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.secret_key,
    cookie: { maxAge: 50 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "charts")));
app.use(express.urlencoded({ extended: true }));
app.use("/chart.js-4.4.2", express.static("chart.js-4.4.2"));

app.use(register_ROUTE);
app.use(dashboard_ROUTE);
app.use(admin_ROUTE);

const connection = async () => {
  try {
    await app.listen(8000, () =>
      console.log("Sever is listening on Sever : 8000")
    );
    console.log(`http://localhost:8000/prayaas/home`);
  } catch (error) {
    console.log(error);
  }
};
connection();
