const User = require("../model/user.model");
const { GenerateOtp } = require("../utility/notification");
const Jwt = require("jsonwebtoken");
const {
  gensalt,
  hashpassword,
  GeneratesSignature,
} = require("../utility/password.hash");
const { registrationSchema, verifySchema } = require("./user.dto");

const addUser = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { phone_no, country_code, country_name } = req.body;

    // Check if user already exists with the given phone number
    let existingUser = await User.findOne({ phone_no: phone_no });
    if (existingUser) {
      // Generate JWT for the existing user
      let signature = await GeneratesSignature({
        _id: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      });

      // Return the existing user details along with the token
      return res
        .status(200)
        .json({ signature, verified: existingUser.verified });
    }

    const { otp, expiry } = GenerateOtp();

    let result = await User.create({
      phone_no: phone_no,
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      country_code: country_code,
      country_name: country_name,
      otp: "1234", // Consider using the actual `otp` variable here
      otp_expire: expiry,
      verified: false,
      plan: "",
    });

    if (result) {
      let signature = await GeneratesSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified,
      });

      return res.status(201).json({ signature, verified: result.verified });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { error } = verifySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = req.user;
    const { otp } = req.body;

    if (user) {
      let verifyUser = await User.findById(user?._id);
      if (verifyUser?.otp === otp) {
        verifyUser.verified = true;
        let updatedVerifyuser = await verifyUser.save();
        let signature = await GeneratesSignature({
          _id: updatedVerifyuser._id,
          verified: updatedVerifyuser.verified,
        });
        return res.status(200).json({
          signature,
          verified: updatedVerifyuser?.verified,
          _id: updatedVerifyuser?._id,
        });
      }
    }
    return res.status(400).json({ message: "Not verified sucessfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const query = constructSearchQuery(req.query);
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    let allUser = await User.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("plan");
    const total = await User.countDocuments(query);
    const planRespond = {
      data: allUser,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    return res.status(200).json(planRespond);
  } catch (err) {
    console.log(err);
    return res.json({ message: "Internal server error" });
  }
};

const constructSearchQuery = (queryParams) => {
  const constructedQuery = {};

  if (queryParams.startdate && queryParams.enddate) {
    const startDate = new Date(queryParams.startdate);
    const endDate = new Date(queryParams.enddate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid date strings for startdate or enddate.");
      return constructedQuery; // Return an empty query or handle the error as needed
    }

    endDate.setHours(23, 59, 59, 999);

    constructedQuery.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  if (queryParams.freeUser) {
    constructedQuery["plan.plantype.amount"] = { $lte: 0 };
  }

  if (queryParams.paidUser) {
    constructedQuery["plan.plantype.amount"] = { $gt: 0 };
  }

  return constructedQuery;
};

const addLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email) {
    try {
      let existingUser = await User.findOne({ email: email });
      if (existingUser) {
        if (existingUser.password === password) {
          let signature = await GeneratesSignature({
            _id: existingUser?._id,
            email: existingUser?.email,
          });
          return res.status(200).json({
            token: signature,
          });
        }
      }

      return res.json({
        Message: "Invalid Credential",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred while checking the database" });
    }
  }
  // else {
  //     return res.json({
  //         "Message": "Login failed"
  //     })
  // }
};

const getUserDetails = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    // Check if token starts with "Bearer " and extract the actual token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7, authHeader.length)
      : authHeader;

    // Log the received token and JWT secret for debugging
    console.log("Received Token:", token);
    console.log("JWT Secret:", process.env.SECRET_KEY);

    let decoded;
    try {
      // Verify the token using the JWT secret
      decoded = Jwt.verify(token, process.env.SECRET_KEY); // Ensure the secret matches the one used during token generation
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(400).json({ message: "Invalid token." });
    }

    // Extract user ID from the decoded token
    const userId = decoded._id;

    // Fetch the user details from the database
    const user = await User.findById(userId).select(
      "-password -otp -otp_expire"
    ); // Exclude sensitive fields like password and OTP

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user details in the response
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user details:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
    try {
      // Extract user ID from the request body
      const { userId } = req.body;
  
      if (!userId) {
        console.error('User ID is missing in the request body');
        return res.status(400).json({ message: 'User ID is required.' });
      }
  
      // Find the user by ID in the database
      const user = await User.findById(userId);
      if (!user) {
        console.error(`User not found with ID: ${userId}`);
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Extract fields from the request body to update
      const {
        phone_no,
        email,
        firstname,
        lastname,
        password,
        country_code,
        country_name,
      } = req.body;
  
      // Update user fields only if they are provided
      if (phone_no !== undefined) user.phone_no = phone_no;
      if (email !== undefined) user.email = email; // Check for undefined to allow empty strings
      if (firstname !== undefined) user.firstname = firstname;
      if (lastname !== undefined) user.lastname = lastname;
      if (password !== undefined) {
        // Hash the password if needed
        // Example: user.password = await bcrypt.hash(password, 10);
        user.password = password; // Placeholder; hash the password before saving in a real scenario
      }
      if (country_code !== undefined) user.country_code = country_code;
      if (country_name !== undefined) user.country_name = country_name;
  
      // Save the updated user details to the database
      const updatedUser = await user.save();
  
      // Respond with the updated user details
      return res.status(200).json({ user: updatedUser });
    } catch (err) {
      console.error('Error updating user details:', err); // Log the full error object
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports = {
  addUser,
  verifyUser,
  addLogin,
  getUser,
  getUserDetails,
  updateUser
};
