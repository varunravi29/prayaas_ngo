const connection = require("../config/database");

const ADMIN__fetchOrganizationData = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM signupdb_organization`;
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const ADMIN__fetchIndividualData = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM signupdb_individual`;
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const ADMIN__fetchTotalDonationData = async (donor_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(amount) FROM money_donate WHERE donor_id = ?`;
    connection.query(sql, [donor_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteByDonorId = (req, res) => {
  const donor_id = req.query.donor_id; // Accessing donor_id from query parameters
  const sql1 = `DELETE FROM signupdb_individual WHERE donor_id = ?`;
  const sql2 = `DELETE FROM signupdb_organization WHERE donor_id = ?`;

  connection.query(sql1, [donor_id], (error, results1) => {
    if (error) {
      console.error("Error deleting from signupdb_individual:", error);
      return res.status(500).send("Internal Server Error");
    }

    if (results1.affectedRows === 0) {
      connection.query(sql2, [donor_id], (error, results2) => {
        if (error) {
          console.error("Error deleting from money_donate:", error);
          return res.status(500).send("Internal Server Error");
        }

        if (results2.affectedRows > 0) {
          return res.redirect("http://localhost:8000/prayaas/usersInfo");
        } else {
          return res.status(404).send("Donor ID not found");
        }
      });
    } else {
      // If rows were affected in the first table, redirect to usersInfo page
      return res.redirect("http://localhost:8000/prayaas/usersInfo");
    }
  });
};

const totalOrganization = async () => {
  const sql = `SELECT COUNT(donor_id) AS totalOrganization FROM signupdb_organization`;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error("Error counting the organization:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Return the total organization count
    return results[0].totalOrganization;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const totalIndividual = async () => {
  const sql = `SELECT COUNT(donor_id) AS totalIndividual FROM signupdb_individual`;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error("Error counting the individual:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Return the total organization count
    return results[0].totalIndividual;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const totalFundedReceived = async () => {
  const sql = `SELECT SUM(amount) AS totalOrganisationFunded FROM money_donate`;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error("Error counting the totalOrganisationFunded:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results[0].totalOrganisationFunded;
  } catch (error) {
    console.log(error);
  }
};

const totalItemsDonated = async () => {
  const sql = `SELECT SUM(quantity) AS totalItemsDonated FROM items_donate `;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.log("Error Counting the totalItemsDonated:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results[0].totalItemsDonated;
  } catch (error) {
    console.log(error);
  }
};

const sumOfDonationByIndividual = async () => {
  const sql = `SELECT SUM(quantity) AS totalItemsDonated FROM items_donate `;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.log("Error Counting the totalItemsDonated:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results[0].totalItemsDonated;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  ADMIN__fetchOrganizationData,
  ADMIN__fetchIndividualData,
  ADMIN__fetchTotalDonationData,
  totalFundedReceived,
  totalItemsDonated,
  deleteByDonorId,
  totalOrganization,
  totalIndividual,
};
