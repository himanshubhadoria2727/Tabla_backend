
const userroute = require('./modules/user.route')


const registerRoute = (app) => {
    app.use('/api/user', userroute)

}

module.exports = {
    registerRoute
}