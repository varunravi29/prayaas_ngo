const connection = require("../config/database");

const donate_By_Money = async (
  donation_id,
  donor_id,
  date,
  amount,
  description
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO money_donate (
        donation_id,  
        donor_id,
        date,
        amount,
        description) VALUES(?,?,?,?,?)`;

      connection.query(
        sql,
        [donation_id, donor_id, date, amount, description],
        async (error, results) => {
          if (error) {
            console.error(
              "Error inserting into money_donate table:",
              error.message
            );
            reject(error);
          } else {
            resolve(results.affectedRows === 1);

            console.log("Successfully added the donations");
          }
        }
      );
    } catch (error) {}
  });
};

const random_donation_id_generator = async () => {
  try {
    const min = 1000000;
    const max = 9999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } catch (error) {
    console.log("Unable to generate the Donation_ID");
    throw error;
  }
};

const random_request_id_generator = async () => {
  try {
    const min = 1000000;
    const max = 9999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } catch (error) {
    console.log("Unable to generate the Donation_ID");
    throw error;
  }
};

const donate_By_Items = async (
  donation_id,
  donor_id,
  date,
  donate_type,
  quantity,
  description
) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `INSERT INTO items_donate (
        donation_id,
        donor_id,
        date,
        donate_type,
        quantity,
        description
      ) VALUES (?, ?, ?, ?, ?, ?)`;

      connection.query(
        sql,
        [donation_id, donor_id, date, donate_type, quantity, description],
        (error, results) => {
          if (error) {
            console.error("Error inserting into items_donate table:", error);
            reject(error);
          } else {
            console.log("Successfully added donation to items_donate table");
            resolve(results);
          }
        }
      );
    } catch (error) {
      console.error("Error in donate_By_Items:", error);
      reject(error);
    }
  });
};
const request_for_Amount = async (
  request_id,
  donor_id,
  date,
  amount,
  description
) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `INSERT INTO amount_request (
        request_id,
        donor_id,
        date,
        amount,
        description
      ) VALUES (?, ?, ?, ?, ?)`;

      connection.query(
        sql,
        [request_id, donor_id, date, amount, description],
        (error, results) => {
          if (error) {
            console.error("Error inserting into request amount table:", error);
            reject(error);
          } else {
            console.log("Successfully added donation to amount request table");
            resolve(results);
          }
        }
      );
    } catch (error) {
      console.error("Error in request for amount:", error);
      reject(error);
    }
  });
};
const request_for_Items = async (
  request_id,
  name,
  email_id,
  donor_id,
  contact,
  date,
  request_type,
  quantity,
  description
) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `INSERT INTO items_request (
        request_id,
        name,
        email_id,
        donor_id,
        contact,
        date,
        request_type,
        quantity,
        description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        sql,
        [
          request_id,
          name,
          email_id,
          donor_id,
          contact,
          date,
          request_type,
          quantity,
          description,
        ],
        (error, results) => {
          if (error) {
            console.error("Error inserting into request amount table:", error);
            reject(error);
          } else {
            console.log("Successfully added donation to amount request table");
            resolve(results);
          }
        }
      );
    } catch (error) {
      console.error("Error in request for amount:", error);
      reject(error);
    }
  });
};

module.exports = {
  donate_By_Money,
  donate_By_Items,
  random_donation_id_generator,
  random_request_id_generator,
  request_for_Amount,
  request_for_Items,
};
