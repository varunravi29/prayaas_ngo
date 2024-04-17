require("dotenv").config;
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const register_ROUTE = require("./routes/register_ROUTE");
const dashboard_ROUTE = require("./routes/dashboard_routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.secret_key,
    cookie: { maxAge: 5 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(register_ROUTE);
app.use(dashboard_ROUTE);

// USER-REDIRECTING-ROUTES

// /PRAYAAS/REGISTER FOR THE INDIVIDUAL
app.get("/prayaas/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// /PRAYAAS/REGISTERER FOR THE ORGANISATION
app.get("/prayaas/registerOrg", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "registerOrg.html"));
});

// PRAYAAS/LOGIN FOR THE BOTH INDIVIDUAL AND ORGANISATION
app.get("/prayaas/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

///PRAYAAS/HOME FOR THE WEBSITE HOMEPAGE
app.get("/prayaas/home", async (req, res) => {
  
  res.sendFile(path.join(__dirname, "public", "ngo.html"));
});

// /PRAYAAS/OTPAUTH FOR THE INDIVIDUAL
app.get("/prayaas/otpauth", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "otp_window.html"));
});

// PRAYAAS/OTPAUTH FOR THE ORGANIZATION
app.get("/prayaas/otpauthOrg", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "otp_window _org.html"));
});

// ADMIN_TERMINAL_DETAILS
app.get("/prayaas/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// USER-DASHBOARD-ROUTES
// HOME-PAGE
app.get("/prayaas/user/home", async (req, res) => {
  const getTokenFromReq = await req.session.token;
  if (getTokenFromReq) {
    res.render("home", {
      email_id: req.session.email_id,
      donor_id: req.session.donor_id,
      name: req.session.name,
      mobile_no: req.session.mobile_no,
    });
  } else {
    res.redirect("http://localhost:8000/prayaas/login");
  }
});
// GENERATE-REQUEST-PAGE
app.get("/prayaas/user/request", (req, res) => {
  res.render("generate_request", {
    email_id: req.session.email_id,
    donor_id: req.session.donor_id,
    name: req.session.name,
    mobile_no: req.session.mobile_no,
  });
});
// HOME-PAGE
app.get("/prayaas/user/payment_history", (req, res) => {
  res.render("payments", {
    donor_id: req.session.donor_id,
    name: req.session.name,
    email_id: req.session.email_id,
    mobile_no: req.session.mobile_no,
  });
});
// HOME-PAGE
app.get("/prayaas/user/donate", (req, res) => {
  res.render("donate", {
    email_id: req.session.email_id,
    donor_id: req.session.donor_id,
    name: req.session.name,
    mobile_no: req.session.mobile_no,
  });
});

const connection = async () => {
  try {
    await app.listen(8000, () =>
      console.log("Sever is listening on Sever : 8000")
    );
  } catch (error) {
    console.log(error);
  }
};
connection();
