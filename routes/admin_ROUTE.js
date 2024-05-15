// routes/admin_routes.js

const path = require("path");
const express = require("express");
const router = express.Router();
const {
  totalDonationAmountForIndividual,
  ADMIN__fetchTotalDonationData,
  ADMIN__fetchOrganizationData,
  ADMIN__fetchIndividualData,
  totalOrganizationGraph,
  totalIndividualGraph,
  totalFundedReceived,
  totalItemsDonated,
  totalOrganization,
  requested_amount,
  deleteByDonorId,
  totalIndividual,
  requested_Items, //this one
  deleteRequests,
  login_4_admin,
  totalDonatedMoney,
  updateStatus,
  updateForm,
} = require("../controllers.js/admin_controlles");

const {
  organizationType,
  totalUsersDonateMoney,
  totalItemReceivedCount,
  amountDonatedDate,
  amountRequestedDate,
  ItemsCounts
} = require("../controllers.js/dashboard_controlles");

router.get("/delete", deleteByDonorId);
router.post("/updateForm", updateForm);
router.get("/prayaas/usersInfo", async (req, res) => {
  try {
    const totalDonaForIndiv = await totalDonationAmountForIndividual();
    const organizations = await ADMIN__fetchOrganizationData();
    const individuals = await ADMIN__fetchIndividualData();
    const totalDonation = await ADMIN__fetchTotalDonationData();
    res.render("usersInfo", {
      organizations: organizations,
      individuals: individuals,
      totalDonation: totalDonation[0]["COUNT(*)"],
      totalDonaForIndiv: totalDonaForIndiv,
    });
  } catch (error) {
    console.error("Error fetching Organization Data: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/prayaas/admin", async (req, res) => {
  try {
    const toc = await totalOrganization();
    const tic = await totalIndividual();
    const tfr = await totalFundedReceived();
    const tid = await totalItemsDonated();
    const tig = await totalIndividualGraph();
    const tdm = await totalDonatedMoney();
    res.render("admin", {
      toc: toc,
      tic: tic,
      tfr: tfr,
      tid: tid,
      tig: tig,
      tdm: tdm
    });
  } catch (error) {
    console.error("Error fetching Organization Data: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.get("/prayaas/request_window", async (req, res) => {
  try {
    const amounts = await requested_amount();
    const items = await requested_Items();
    res.render("request_window", {
      amounts: amounts,
      items: items,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/prayaas/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.login.html"));
});
router.post("/updateStatus", updateStatus);
router.post("/login_4_admin", login_4_admin);
router.post("/deleteRequest", deleteRequests);

// For graphs separate route handler

router.get("/prayaas/admin/data3", async (req, res) => {
  try {
    const individualDataGraph = await totalIndividualGraph();
    const organizationDataGraph = await totalOrganizationGraph();
    const totalUsersDonatedMoney = await totalUsersDonateMoney();
    const food = await totalItemReceivedCount("Food");
    const clothes = await totalItemReceivedCount("Clothes");
    const amountAndDate = await amountDonatedDate();
    const orgType1 = await organizationType("Private");
    const orgType2 = await organizationType("Community");
    const orgType3 = await organizationType("Government-Initiated");
    const orgType4 = await organizationType("International");
    const orgType5 = await organizationType("Advocacy");
    const clothesQuantity = await ItemsCounts("Clothes");
    const foodQuantity = await ItemsCounts("Food");
    const amountRequestDate = await amountRequestedDate();
    if (
      individualDataGraph &&
      organizationDataGraph &&
      totalUsersDonatedMoney &&
      amountRequestDate &&
      amountAndDate &&
      food &&
      clothes &&
      typeof individualDataGraph === "object" &&
      typeof organizationDataGraph === "object"
    ) {
      res.json({
        amountAndDate,
        amountRequestDate,
        totalUsersDonatedMoney,
        food,
        clothes,
        individualDataGraph,
        organizationDataGraph,
        orgType1,
        orgType2,
        orgType3,
        orgType4,
        orgType5,
        clothesQuantity,
        foodQuantity
      });
    } else {
      console.error("Invalid data received");
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
