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

const getUser = async (req, res) => {
    try {
        const query = constructSearchQuery(req.query);
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;



        let allUser = await User.find(query).skip(skip).limit(pageSize).populate('plan');
        const total = await User.countDocuments(query)
        const planRespond = {
            data: allUser,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),


            }

        }
        return res.status(200).json(planRespond)
    } catch (err) {
        console.log(err);
        return res.json({ "message": "Internal server error" })
    }
}


const constructSearchQuery = (queryParams) => {
    const constructedQuery = {};

    if (queryParams.startdate && queryParams.enddate) {
        const startDate = new Date(queryParams.startdate);
        const endDate = new Date(queryParams.enddate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date strings for startdate or enddate.');
            return constructedQuery;  // Return an empty query or handle the error as needed
        }

        endDate.setHours(23, 59, 59, 999);

        constructedQuery.createdAt = {
            $gte: startDate,
            $lte: endDate
        };
    }

    if (queryParams.freeUser) {
        constructedQuery['plan.plantype.amount'] = { $lte: 0 };
    }

    if (queryParams.paidUser) {
        constructedQuery['plan.plantype.amount'] = { $gt: 0 };
    }

    return constructedQuery;
};








module.exports = {
    addUser, verifyUser
}