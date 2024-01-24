const { ValidateSignature } = require("../utility/password.hash")

const Authenticateuser = async (req, res, next) => {
    let validate = await ValidateSignature(req.body)
    if (validate) {
        return next()
    } else {
        return res.json({
            "message": "User are not authenticate"
        })
    }

}