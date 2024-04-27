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

        // Check if any rows were affected in the second table
        if (results2.affectedRows > 0) {
          return res.redirect("http://localhost:8000/prayaas/usersInfo");
        } else {
          // Neither table had records for the donor_id
          return res.status(404).send("Donor ID not found");
        }
      });
    } else {
      // If rows were affected in the first table, redirect to usersInfo page
      return res.redirect("http://localhost:8000/prayaas/usersInfo");
    }
  });
};



module.exports = {
  ADMIN__fetchOrganizationData,
  ADMIN__fetchIndividualData,
  ADMIN__fetchTotalDonationData,
  deleteByDonorId
};
