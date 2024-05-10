// routes/admin_routes.js

const path = require("path");
const express = require("express");
const router = express.Router();
const {
  ADMIN__fetchOrganizationData,
  ADMIN__fetchTotalDonationData,
  ADMIN__fetchIndividualData,
  totalFundedReceived,
  totalItemsDonated,
  totalOrganization,
  requested_amount,
  deleteByDonorId,
  totalIndividual,
  requested_Items,
  deleteRequests,
  login_4_admin,
  updateStatus,
} = require("../controllers.js/admin_controlles");

router.get("/delete", deleteByDonorId);

router.get("/prayaas/usersInfo", async (req, res) => {
  try {
    const organizations = await ADMIN__fetchOrganizationData();
    const individuals = await ADMIN__fetchIndividualData();
    const totalDonation = await ADMIN__fetchTotalDonationData();
    res.render("usersInfo", {
      organizations: organizations,
      individuals: individuals,
      totalDonation: totalDonation[0]["COUNT(*)"],
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
    res.render("admin", {
      toc: toc,
      tic: tic,
      tfr: tfr,
      tid: tid,
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

module.exports = router;
