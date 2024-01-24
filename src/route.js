
const userroute = require('./modules/user.route')


const registerRoute = (app) => {
    app.use(userroute)

}

module.exports = {
    registerRoute
}