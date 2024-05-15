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

const totalOrganizationGraph = async () => {
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
    return { totalOrganization: results[0].totalOrganization }; // Adjusted this line
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

const totalIndividualGraph = async () => {
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

    // Return the total individual count in an object
    return { totalIndividual: results[0].totalIndividual };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const totalDonatedMoney = async () => {
  const sql = `SELECT SUM(amount) AS donatedMoney FROM amount_request where status = 'Accepted'`;
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

    // Return the total individual count in an object
    return results[0].donatedMoney;
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
const requested_amount = async () => {
  const sql = `SELECT
    si.name, 
    ar.donor_id, 
    ar.request_id, 
    si.email_id,  
    si.mobile_no,  
    ar.amount,
    ar.date,  
    ar.status,
    ar.description
  FROM amount_request ar 
  JOIN signupdb_individual si ON ar.donor_id = si.donor_id
  UNION ALL
  SELECT
    so.name, 
    ar.donor_id, 
    ar.request_id, 
    so.email_id,  
    so.mobile_no,  
    ar.amount,
    ar.date,  
    ar.status,
    ar.description
  FROM amount_request ar 
  JOIN signupdb_organization so ON ar.donor_id = so.donor_id`;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.log("Error fetching the requested Amount data:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results;
  } catch (error) {
    console.error("Unexpected error in requested_amount:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

const requested_Items = async () => {
  const sql = `SELECT
    si.name, 
    ar.donor_id, 
    ar.request_id, 
    si.email_id,  
    si.mobile_no,  
    ar.date,
    ar.quantity,  
    ar.status,
    ar.description
  FROM items_request ar 
  JOIN signupdb_individual si ON ar.donor_id = si.donor_id
  UNION ALL
  SELECT
    so.name, 
    ar.donor_id, 
    ar.request_id, 
    so.email_id,  
    so.mobile_no,  
    ar.date,
    ar.quantity,  
    ar.status,
    ar.description
  FROM items_request ar 
  JOIN signupdb_organization so ON ar.donor_id = so.donor_id`;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.log("Error fetching the requested Items data:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return results;
  } catch (error) {
    console.error("Unexpected error in requested_Items:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

const deleteRequests = (req, res) => {
  const { request_id } = req.body;
  const sql1 = `DELETE FROM amount_request WHERE request_id = ? `;
  const sql2 = `DELETE FROM items_request WHERE request_id = ? `;

  connection.query(sql1, [request_id], (error1, results1) => {
    if (error1) {
      console.error("Error deleting amount_request:", error1);
      res.status(500).json({ error: "Failed to delete requests" });
    } else {
      if (results1.affectedRows === 0) {
        connection.query(sql2, [request_id], (error2, results2) => {
          if (error2) {
            console.error("Error deleting items_request:", error2);
            res.status(500).json({ error: "Failed to delete requests" });
          } else {
            if (results2.affectedRows === 0) {
              res.status(404).json({ error: "Request ID not found" });
            } else {
              res.redirect("http://localhost:8000/prayaas/request_window");
            }
          }
        });
      } else {
        res.redirect("http://localhost:8000/prayaas/request_window");
      }
    }
  });
};

const updateStatus = (req, res) => {
  const { request_id, status } = req.body;
  const sql1 = `UPDATE amount_request SET status = ? WHERE request_id = ?`;
  const sql2 = `UPDATE items_request SET status = ? WHERE request_id = ?`;

  connection.query(sql1, [status, request_id], (error1, results1) => {
    if (error1) {
      console.error("Error updating amount_request:", error1);
      res.status(500).json({ error: "Failed to update status" });
    } else {
      if (results1.affectedRows === 0) {
        connection.query(sql2, [status, request_id], (error2, results2) => {
          if (error2) {
            console.error("Error updating items_request:", error2);
            res.status(500).json({ error: "Failed to update status" });
          } else {
            if (results2.affectedRows === 0) {
              res.status(404).json({ error: "Request ID not found" });
            } else {
              res.redirect("http://localhost:8000/prayaas/request_window");
            }
          }
        });
      } else {
        res.redirect("http://localhost:8000/prayaas/request_window");
      }
    }
  });
};

const login_4_admin = async (req, res) => {
  const { email_id, password } = req.body;
  if (email_id == "prayaas@gmail.com" && password == "admin@123") {
    res.redirect("http://localhost:8000/prayaas/admin");
  } else {
    res.redirect("http://localhost:8000/prayaas/admin/login");
  }
};

const totalDonationAmountForIndividual = async () => {
  try {
    const sql = `SELECT donor_id, SUM(amount) AS totalDonation FROM money_donate GROUP BY donor_id`;
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.log(
            "Error fetching data from totalDonationAmountForIndividual:",
            error
          );
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateForm = async (req, res) => {
  try {
    const { donor_id, mobile_no, address, password } = req.body;
    const sql1 = `UPDATE signupdb_individual SET mobile_no = ?, address = ?, password = ? WHERE donor_id = ?`;
    const sql2 = `UPDATE signupdb_organization SET mobile_no = ?, address = ?, password = ? WHERE donor_id = ?`;

    // Update individual's data
    const updateIndividual = await new Promise((resolve, reject) => {
      connection.query(
        sql1,
        [mobile_no, address, password, donor_id],
        (error, results) => {
          if (error) {
            console.log("Error updating individual data:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    const updateOrganization = await new Promise((resolve, reject) => {
      connection.query(
        sql2,
        [mobile_no, address, password, donor_id],
        (error, results) => {
          if (error) {
            console.log("Error updating organization data:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.redirect("http://localhost:8000/prayaas/usersInfo");
  } catch (error) {
    console.log("Unexpected error in updateForm:", error);
    // Handle error response here
    res.status(500).send("Internal Server Error");
    throw error;
  }
};

module.exports = {
  totalDonationAmountForIndividual,
  ADMIN__fetchOrganizationData,
  ADMIN__fetchIndividualData,
  ADMIN__fetchTotalDonationData,
  totalOrganizationGraph,
  totalIndividualGraph,
  totalDonatedMoney,
  totalFundedReceived,
  totalItemsDonated,
  totalOrganization,
  requested_amount,
  deleteByDonorId,
  requested_Items,
  totalIndividual,
  deleteRequests,
  login_4_admin,
  updateStatus,
  updateForm,
};
