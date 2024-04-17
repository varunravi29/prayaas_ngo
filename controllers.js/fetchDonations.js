// fetchDonations.js

const fetchMoneyDonations = require("./dashboard_controlles");
const fetchItemDonations = require("./dashboard_controlles");

const fetchDonations = async () => {
  try {
    const moneyDonations = await fetchMoneyDonations();
    const itemDonations = await fetchItemDonations();

    return { moneyDonations, itemDonations };
  } catch (error) {
    throw new Error("Error fetching donations: " + error.message);
  }
};

module.exports = fetchDonations;
