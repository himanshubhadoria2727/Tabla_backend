const User = require("../model/user.model");
const { GenerateOtp } = require("../utility/notification");
const { gensalt, hashpassword, GeneratesSignature } = require("../utility/password.hash");
const { registrationSchema, verifySchema } = require('./user.dto')


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

const verifyUser = async (req, res) => {
    try {
        const { error } = verifySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        let user = req.user
        const { otp } = req.body

        if (user) {
            let verifyUser = await User.findById(user?._id)
            if (verifyUser?.otp === otp) {
                verifyUser.verified = true
                let updatedVerifyuser = await verifyUser.save()
                let signature = await GeneratesSignature({
                    _id: updatedVerifyuser._id,
                    verified: updatedVerifyuser.verified
                })
                return res.status(200).json({
                    signature, verified: updatedVerifyuser?.verified, _id: updatedVerifyuser?._id
                })
            }
        }
        return res.status(400).json({ message: 'Not verified sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": 'Internal Server Error' });
    }

}






module.exports = {
    addUser, verifyUser
}