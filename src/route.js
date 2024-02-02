
const userRoute = require('./modules/user.route')
const planRoute = require('./modules/plan/plan.route')
const userPlan = require('./modules/user_plan/user.route')

const contentRoute = require('./modules/content/content.route')


const registerRoute = (app) => {
    app.use('/api/user', userRoute)
    app.use('/api/plan', planRoute)
    app.use('/api', userPlan)
    app.use('/api/content', contentRoute)



}

module.exports = {
    registerRoute
}