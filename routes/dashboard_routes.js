const express = require("express");
const router = express.Router();
const {
  handle_donate_as_money_form,
  handle_donate_as_items_form,
  handle_request_for_money,
  handle_request_for_items,
  amountDonatedByDonor_Id,
  fetchMoneyDonations,
  fetchItemDonations, // Import fetchItemDonations function
  getPaymentDateTime,
  amount_received,
  ItemsCount,
} = require("../controllers.js/dashboard_controlles");

// some controllers from the admin
const {
  requested_amount,
  requested_Items,
} = require("../controllers.js/admin_controlles");

const validateToken = require("../ErrorHandling/validateToken");

router.post("/money_donate", handle_donate_as_money_form);
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
        donate_items: donate_items,
        getTime: getPaymentDateTime,
      });
    })
    .catch((error) => {
      console.error("Error fetching donations:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});

router.get("/prayaas/user/home", async (req, res) => {
  if (req.session.donor_id) {
    try {
      const donatedAmount = await amountDonatedByDonor_Id(req.session.donor_id);
      const amountReceived = await amount_received(req.session.donor_id);
      const ElectronicDevices = await ItemsCount(
        req.session.donor_id,
        "Electronic Devices"
      );
      const Clothes = await ItemsCount(req.session.donor_id, "Clothes");
      const Food = await ItemsCount(req.session.donor_id, "Food");
      const Books = await ItemsCount(req.session.donor_id, "Books");
      const Toys = await ItemsCount(req.session.donor_id, "Toys");
      const Furniture = await ItemsCount(req.session.donor_id, "Furniture");
      const MedicalSupplies = await ItemsCount(
        req.session.donor_id,
        "Medical Supplies"
      );
      const HygieneProducts = await ItemsCount(
        req.session.donor_id,
        "Hygiene Products"
      );
      const SchoolSupplies = await ItemsCount(
        req.session.donor_id,
        "School Supplies"
      );
      res.render("home", {
        email_id: req.session.email_id,
        donor_id: req.session.donor_id,
        name: req.session.name,
        mobile_no: req.session.mobile_no,
        amountDonatedByDonor_Id: donatedAmount,
        amountReceived: amountReceived,

        Food: Food,
        Books: Books,
        Clothes: Clothes,
        ElectronicDevices: ElectronicDevices,
        Toys: Toys,
        Furniture: Furniture,
        MedicalSupplies: MedicalSupplies,
        HygieneProducts: HygieneProducts,
        SchoolSupplies: SchoolSupplies,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.redirect("http://localhost:8000/prayaas/login");
  }
});

// USER/REQUEST
router.get("/prayaas/user/request", async (req, res) => {
  if (req.session.donor_id) {
    try {
      const amountReqs = await requested_amount();
      const itemsReqs = await requested_Items();
      res.render("generate_request", {
        email_id: req.session.email_id,
        donor_id: req.session.donor_id,
        name: req.session.name,
        mobile_no: req.session.mobile_no,
        amountReqs: amountReqs,
        itemsReqs: itemsReqs,
        amountDonatedByDonor_Id: amountDonatedByDonor_Id,
        getTime: getPaymentDateTime,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.redirect("http://localhost:8000/prayaas/login");
  }
});

// USER/PAYMENT_HISTORY
router.get("/prayaas/user/payment_history", (req, res) => {
  if (req.session.donor_id) {
    try {
      res.render("payments", {
        donor_id: req.session.donor_id,
        name: req.session.name,
        email_id: req.session.email_id,
        mobile_no: req.session.mobile_no,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.redirect("http://localhost:8000/prayaas/login");
  }
});

// USER/DONATE
router.get("/prayaas/user/donate", (req, res) => {
  if (req.session.donor_id) {
    try {
      res.render("donate", {
        email_id: req.session.email_id,
        donor_id: req.session.donor_id,
        name: req.session.name,
        mobile_no: req.session.mobile_no,
        getTime: getPaymentDateTime,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.redirect("http://localhost:8000/prayaas/login");
  }
});

module.exports = router;
