const User = require("../model/user.model");
const { GenerateOtp } = require("../utility/notification");
const { gensalt, hashpassword, GeneratesSignature } = require("../utility/password.hash");
const registrationSchema = require("./user.dto");



const adduser = async (req, res) => {
    try {
        const { error } = registrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { phone_no, country_code, country_name } = req.body;

        // Check if user already exists with the given phone number
        let existingUser = await User.findOne({ phone_no: phone_no });
        if (existingUser) {
            return res.status(400).json({ "message": "User is already registered" });
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
            otp: "1234",
            otp_expire: expiry,
            verified: false,
            plan: ""
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
        return res.status(500).json({ "message": 'Internal Server Error' });
    }
};


module.exports = {
    adduser
}