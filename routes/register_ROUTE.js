const path = require("path");
const express = require("express");
const router = express.Router();
const {
  handle_registration_individual,
  handle_registration_organisation,
  handle_login_individual_And_organization,
  handle_otp_authenticator,
  verifyToken,
} = require("../controllers.js/usercontrolles");

/* REGISTER AND LOGIN ROUTES */
router.post("/register_individual", handle_registration_individual);
router.post("/register_organisation", handle_registration_organisation);
router.post(
  "/login_individual_And_organization",
  handle_login_individual_And_organization
);
router.post("/otp_authenticate", handle_otp_authenticator);
/* REGISTER AND LOGIN ROUTES */

// USER-REDIRECTING-ROUTES

// /PRAYAAS/REGISTER FOR THE INDIVIDUAL
router.get("/prayaas/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "register.html"));
});

// /PRAYAAS/REGISTERER FOR THE ORGANISATION
router.get("/prayaas/registerOrg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "registerOrg.html"));
});

// /PRAYAAS/LOGIN FOR THE BOTH INDIVIDUAL AND ORGANISATION
router.get("/prayaas/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// /PRAYAAS/HOME FOR THE WEBSITE HOMEPAGE
router.get("/prayaas/home", async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "ngo.html"));
});

// /PRAYAAS/OTPAUTH FOR THE INDIVIDUAL
router.get("/prayaas/otpauth", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "otp_window.html"));
});

// /PRAYAAS/OTPAUTH {FOR THE ORGANIZATION}
router.get("/prayaas/otpauthOrg", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "otp_window _org.html"));
});

// ADMIN_TERMINAL_DETAILS
router.get("/prayaas/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});



module.exports = router;
