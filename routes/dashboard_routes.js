const express = require("express");
const router = express.Router();
const {
  handle_donate_as_money_form,
  handle_donate_as_items_form,
  fetchItemDonations, // Import fetchItemDonations function
  fetchMoneyDonations,
  handle_request_for_items,
  handle_request_for_money,
} = require("../controllers.js/dashboard_controlles");

const validateToken = require("../ErrorHandling/validateToken");

router.post("/money_donate", validateToken, handle_donate_as_money_form);
router.post("/items_donate", handle_donate_as_items_form);
router.post("/items_request", handle_request_for_items);
router.post("/amount_request", handle_request_for_money);

// HOME-PAGE
router.get("/prayaas/user/payment_history", (req, res) => {
  const donor_id = req.session.donor_id;

  // Fetch both money and item donations for the logged-in donor
  Promise.all([fetchMoneyDonations(donor_id), fetchItemDonations(donor_id)])
    .then(([donate_money, donate_items]) => {
      // Render the view with both money and item donations
      res.render("payments", {
        donor_id: req.session.donor_id,
        name: req.session.name,
        email_id: req.session.email_id,
        mobile_no: req.session.mobile_no,
        donate_money: donate_money,
        donate_items: donate_items, // Pass the fetched donate_items array to the view
      });
    })
    .catch((error) => {
      console.error("Error fetching donations:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});

// USER/REQUEST
router.get("/prayaas/user/request", (req, res) => {
  res.render("generate_request", {
    email_id: req.session.email_id,
    donor_id: req.session.donor_id,
    name: req.session.name,
    mobile_no: req.session.mobile_no,
  });
});
// USER/PAYMENT_HISTORY
router.get("/prayaas/user/payment_history", (req, res) => {
  res.render("payments", {
    donor_id: req.session.donor_id,
    name: req.session.name,
    email_id: req.session.email_id,
    mobile_no: req.session.mobile_no,
  });
});
// USER/DONATE
router.get("/prayaas/user/donate", (req, res) => {
  res.render("donate", {
    email_id: req.session.email_id,
    donor_id: req.session.donor_id,
    name: req.session.name,
    mobile_no: req.session.mobile_no,
  });
});

module.exports = router;
