const express = require("express");
const router = express.Router();
const {
  handle_registration_individual,
  handle_registration_organisation,
  handle_login_individual_And_organization,
  handle_otp_authenticator
} = require("../controllers.js/usercontrolles");

router.post("/register_individual", handle_registration_individual);
router.post("/register_organisation", handle_registration_organisation);
router.post("/login_individual_And_organization", handle_login_individual_And_organization);
router.post("/otp_authenticate",handle_otp_authenticator);
module.exports = router;
