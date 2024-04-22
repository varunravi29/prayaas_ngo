require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../config/database");
const connection = require("../config/database");

const {
  registerUserIndividual,
  registerUserOrganisation,
  otpAuthenticator,
  random_donor_id_generator,
} = require("../model/usermodel");

// Generate the json-web-token
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
  return `Bearer ${token}`;
};


const handle_registration_individual = async (req, res) => {
  const { name, email_id, mobile_no, dob, address, gender, password } =
    req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 5);
    const donor_id = await random_donor_id_generator();
    const isValid = await registerUserIndividual(
      donor_id,
      name,
      email_id,
      mobile_no,
      dob,
      address,
      gender,
      hashPassword
    );

    if (isValid) {
      console.log("New user registered:", name);
      req.session.email_id = email_id;
      req.session.donor_id = donor_id;
      req.session.mobile_no = mobile_no;
      res.redirect(
        `http://localhost:8000/prayaas/otpauth?email=${req.session.token}`
      );
    } else {
      res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }
  } catch (error) {
    console.error("Error during individual registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handle_registration_organisation = async (req, res) => {
  const { type, name, email_id, mobile_no, address, password } = req.body;

  const donor_id = await random_donor_id_generator();
  try {
    // We will Hash the Password
    const hashPassword = await bcrypt.hash(password, 5);
    const isValid = await registerUserOrganisation(
      donor_id,
      type,
      name,
      email_id,
      mobile_no,
      address,
      hashPassword
    );

    if (isValid) {
      console.log("New organization registered:", name);
      req.session.email_id = email_id;
      req.session.donor_id = donor_id;
      res.redirect("http://localhost:8000/prayaas/otpauthOrg");
    } else {
      res.status(409).json({
        success: false,
        message: "Organization name or email already exists",
      });
    }
  } catch (error) {
    console.error("Error during organization registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// WORK IS NEEDED HERE
const handle_login_individual_And_organization = async (req, res) => {
  const { email_id, password } = req.body;
  try {
    // Load the user data from the individual table
    const hashPasswordQueryIndividual = `SELECT password, donor_id, name, mobile_no, dob FROM signupdb_individual WHERE email_id = ?`;
    connection.query(
      hashPasswordQueryIndividual,
      [email_id],
      async (error, indResults) => {
        if (error) {
          console.error(
            "Error fetching user data from individual table:",
            error
          );
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        if (indResults.length > 0) {
          const {
            password: hashPasswordStored,
            donor_id,
            name,
            mobile_no,
            dob,
          } = indResults[0];

          const isPasswordMatch = await bcrypt.compare(
            password,
            hashPasswordStored
          );

          if (isPasswordMatch) {
            console.log("Password matches for individual account.");
            console.log("Login successful for:", email_id);

            // Generate Token
            const token = generateToken({
              userId: donor_id,
              email_id: email_id,
            });

            req.session.token = token;
            req.session.email_id = email_id;
            req.session.donor_id = donor_id;
            req.session.name = name;
            req.session.mobile_no = mobile_no;
            req.session.dob = dob;

            return res.redirect(
              `http://localhost:8000/prayaas/user/home?email=${email_id}&donor_id=${donor_id}`
            );
          } else {
            console.log("Invalid credentials for:", email_id);
            return res
              .status(401)
              .json({ success: false, message: "Invalid credentials" });
          }
        } else {
          // If not found in individual table, check organization table
          const hashPasswordQueryOrganization = `SELECT password, donor_id, mobile_no, name FROM signupdb_organization WHERE email_id = ?`;
          connection.query(
            hashPasswordQueryOrganization,
            [email_id],
            async (error, orgResults) => {
              if (error) {
                console.error(
                  "Error fetching user data from organization table:",
                  error
                );
                return res
                  .status(500)
                  .json({ success: false, message: "Internal server error" });
              }

              if (orgResults.length > 0) {
                const {
                  password: hashPasswordStored,
                  donor_id,
                  mobile_no,
                  name,
                } = orgResults[0];
                const isPasswordMatch = await bcrypt.compare(
                  password,
                  hashPasswordStored
                );

                if (isPasswordMatch) {
                  const token = generateToken({
                    userId: donor_id,
                    email_id: email_id,
                  });

                  console.log("Password matches for organization account.");
                  console.log("Login successful for:", email_id);
                  req.session.token = token;
                  req.session.email_id = email_id;
                  req.session.donor_id = donor_id;
                  req.session.name = name;
                  req.session.mobile_no = mobile_no;
                  // Redirect to appropriate dashboard based on user type
                  return res.redirect(
                    `http://localhost:8000/prayaas/user/home?"/"${token}`
                  );
                } else {
                  console.log("Invalid credentials for:", email_id);
                  return res
                    .status(401)
                    .json({ success: false, message: "Invalid credentials" });
                }
              } else {
                console.log("User not found:", email_id);
                return res
                  .status(401)
                  .json({ success: false, message: "Invalid credentials" });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const handle_otp_authenticator = async (req, res) => {
  const { otp } = req.body;
  const email_id = req.session.email_id;

  try {
    console.log("Request body:", req.body);
    console.log("Session email:", email_id);
    console.log("Input OTP:", otp);

    if (email_id && otp) {
      await otpAuthenticator(email_id, otp, res);
    } else {
      console.error("Invalid request parameters");
      res.status(400).json({ message: "Invalid request parameters" });
    }
  } catch (error) {
    console.error("Error during OTP authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handle_registration_individual,
  handle_registration_organisation,
  handle_login_individual_And_organization,
  handle_otp_authenticator,
  generateToken,
  
};
