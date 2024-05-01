// routes/admin_routes.js

const express = require("express");
const router = express.Router();
const {
  ADMIN__fetchOrganizationData,
  ADMIN__fetchIndividualData,
  ADMIN__fetchTotalDonationData,
  totalFundedReceived,
  totalItemsDonated,
  totalOrganization,
  deleteByDonorId,
  totalIndividual,
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

module.exports = router;
