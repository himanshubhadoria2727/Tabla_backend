const Plan = require("../../model/plan.model")
const { Uplan } = require("../../model/user_plan.model")

const moment = require('moment');
const { stripe } = require("../../utility/stripe");
const User = require("../../model/user.model");

const createUserplan = async (req, res) => {
    try {
        const { planId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Not authenticated user' });
        }





        const existingUserPlan = await Uplan.findOne({ user: user._id });

        if (existingUserPlan) {
            const uplanUpdate = await Uplan.findOneAndUpdate({ user: user._id }, { plan: planId }, { new: true });

            let clientsecret = await Createsub(user, planId)
            console.log(clientsecret);
            return res.status(200).json({
                message: "User plan updated@@@@@@@@@@@@@@@@@@2",
                uplanUpdate, ...clientsecret

            });
        }



        const uplan = await Uplan.create({
            user: user._id,
            plan: planId
        });
        let clientsecret = await Createsub(user, planId)
        return res.status(200).json({
            message: "User plan created",
            uplan, ...clientsecret
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



const getUserplan = async (req, res) => {
    try {
        const searchQuery = constructSearchQuery(req.query);
        let allplans = await Plan.find(searchQuery)

        let filter = {};
        console.log(allplans);

        if (allplans && allplans.length > 0) {
            filter.plan = { $in: allplans.map(plan => plan._id) };
        }


        console.log(filter, "checking filter");

        const users = await Uplan.find(filter)
            .populate('user')
            .populate('plan')
            .exec();

        res.json({ users });
    } catch (err) {
        console.log(err);
        return res.json({ "message": "Internal server error" });
    }
};



const constructSearchQuery = (queryParams) => {
    const constructedQuery = {

    };


    if (queryParams.freeUser) {
        constructedQuery['plantype.amount'] = { $lte: 0 };
    }
    if (queryParams.paidUser) {
        constructedQuery['plantype.amount'] = { $gt: 0 };
    }

    return constructedQuery;
};


const Createsub = async (user, plan) => {
    try {
        if (!user || !plan) {
            throw new Error('User or plan not provided');
        }

        const stripeUser = await User.findById(user?._id);
        const stripePlan = await Plan.findById(plan);

        if (!stripeUser || !stripePlan) {
            throw new Error('User or plan not found');
        }

        console.log('Stripe User:', stripeUser);
        console.log('Stripe Plan:', stripePlan);

        const customer = await stripe.customers.create({
            phone: stripeUser?.phone_no
        });

        const product = await stripe.products.create({
            name: stripePlan?.planname,
            type: 'service',
        });

        const checkingPrices = await Promise.all(stripePlan?.plantype?.map(async (singlePlanType) => {
            const price = await stripe.prices.create({
                currency: 'usd',
                unit_amount: 20,
                recurring: {
                    interval: 'month',
                },
                product: product?.id,
            });
            return {
                price: price?.id
            };
        }));

        console.log('Checking Prices:', checkingPrices);

        const subscription = await stripe.subscriptions.create({
            customer: customer?.id,
            items: checkingPrices,
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });
        let respond = {
            client_secret: subscription.latest_invoice.payment_intent.client_secret,
            subscriptionId: subscription.id,

        }
        return respond

    } catch (error) {
        console.error('Error:', error.message);
        // Handle error as per your application's requirements
    }
};

const deletedUser = async (req, res) => {
    const { id } = req?.params
    if (!id) {
        throw new Error('id are not provided');
    }
    let deletedUser = await Uplan.findByIdAndDelete(id)
    return res.status(200).json({
        "message": "user will be deleted sucessfully",
        deletedUser
    })
}


module.exports = {
    createUserplan, getUserplan, deletedUser
}