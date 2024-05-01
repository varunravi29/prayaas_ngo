const connection = require("../config/database");
const {
  donate_By_Money,
  donate_By_Items,
  random_donation_id_generator,
  random_request_id_generator,
  request_for_Amount,
  request_for_Items,
} = require("../model/dashboard");

const handle_request_for_money = async (req, res) => {
  let request_id = await random_request_id_generator();
  const {
    name,
    donor_id,
    email_id,
    contact,
    date,
    request_type,
    amount,
    description,
  } = req.body;
  try {
    const isValid = await request_for_Amount(
      request_id,
      name,
      donor_id,
      email_id,
      contact,
      date,
      request_type,
      amount,
      description
    );
    if (isValid) {
      console.log("Successfully request for money.");
      res.redirect("http://localhost:8000/prayaas/user/home");
    } else {
      res.status(409).json({
        success: false,
        message: "request for money failed",
      });
    }
  } catch (error) {
    console.error("Error during money request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

function getPaymentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const time = now.toLocaleTimeString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date} ${time}`;
}

const handle_request_for_items = async (req, res) => {
  let request_id = await random_request_id_generator();
  const {
    name,
    donor_id,
    email_id,
    contact,
    date,
    request_type,
    quantity,
    description,
  } = req.body;
  try {
    const isValid = await request_for_Items(
      request_id,
      name,
      donor_id,
      email_id,
      contact,
      date,
      request_type,
      quantity,
      description
    );
    if (isValid) {
      console.log("Successfully request for money.");
      res.redirect("http://localhost:8000/prayaas/user/home");
    } else {
      res.status(409).json({
        success: false,
        message: "request for money failed",
      });
    }
  } catch (error) {
    console.error("Error during money request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handle_donate_as_money_form = async (req, res) => {
  let donation_id = await random_donation_id_generator();
  const {
    donor_id,
    request_type,
    name,
    email_id,
    contact,
    date,
    amount,
    description,
  } = req.body;
  try {
    const isValid = await donate_By_Money(
      donation_id,
      donor_id,
      request_type,
      name,
      email_id,
      contact,
      date,
      amount,
      description
    );
    if (isValid) {
      console.log("Successfully Donation as money.");
      res.redirect("http://localhost:8000/prayaas/user/home");
    } else {
      res.status(409).json({
        success: false,
        message: "Donation as money failed",
      });
    }
  } catch (error) {
    console.error("Error during money donation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handle_donate_as_items_form = async (req, res) => {
  let donation_id = await random_donation_id_generator();
  const {
    donor_id,
    request_type,
    name,
    email_id,
    contact,
    date,
    donate_type,
    quantity,
    description,
  } = req.body;
  try {
    const isValid = await donate_By_Items(
      donation_id,
      donor_id,
      request_type,
      name,
      email_id,
      contact,
      date,
      donate_type,
      quantity,
      description
    );
    if (isValid) {
      console.log("Successfully donated items.");
      res.redirect("http://localhost:8000/prayaas/user/home");
    } else {
      res.status(409).json({
        success: false,
        message: "Donation of items failed",
      });
    }
  } catch (error) {
    console.error("Error during item donation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchMoneyDonations = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM money_donate`;
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchItemDonations = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM items_donate`;
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const amountDonatedByDonor_Id = async (donor_id) => {
  const sql =
    "SELECT SUM(amount) AS amountDonatedByDonor_Id FROM money_donate WHERE donor_id = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, [donor_id], (error, results) => {
        if (error) {
          console.log("Error Counting the totalItemsDonated:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results[0].amountDonatedByDonor_Id;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handle_donate_as_money_form,
  handle_donate_as_items_form,
  fetchMoneyDonations,
  fetchItemDonations,
  handle_request_for_items,
  handle_request_for_money,
  getPaymentDateTime,
  amountDonatedByDonor_Id,
};
