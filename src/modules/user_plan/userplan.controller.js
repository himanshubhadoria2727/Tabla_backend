const Plan = require("../../model/plan.model");
const { Uplan } = require("../../model/user_plan.model");

const moment = require("moment");
const { stripe } = require("../../utility/stripe");
const User = require("../../model/user.model");

const createUserplan = async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated user" });
    }

    const existingUserPlan = await Uplan.findOne({ user: user._id });

    if (existingUserPlan) {
      const uplanUpdate = await Uplan.findOneAndUpdate(
        { user: user._id },
        { plan: planId },
        { new: true }
      );

      let clientsecret = await Createsub(user, planId);
      console.log(clientsecret);
      return res.status(200).json({
        message: "User plan updated@@@@@@@@@@@@@@@@@@2",
        uplanUpdate,
        ...clientsecret,
      });
    }

    const uplan = await Uplan.create({
      user: user._id,
      plan: planId,
    });
    let clientsecret = await Createsub(user, planId);
    return res.status(200).json({
      message: "User plan created",
      uplan,
      ...clientsecret,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserplan = async (req, res) => {
  try {
    // Get the search query based on parameters
    const searchQuery = constructSearchQuery(req.query);

    let users;

    if (Object.keys(searchQuery).length === 0) {
      // No filters applied: Fetch all Uplan documents with populated user and plan
      users = await Uplan.find({})
        .populate("user")
        .populate("plan")
        .exec();
    } else {
      // Filters applied: Find plans based on the search query
      const plans = await Plan.find(searchQuery).exec();

      if (plans.length > 0) {
        const planIds = plans.map(plan => plan._id);
        users = await Uplan.find({ plan: { $in: planIds } })
          .populate("user")
          .populate("plan")
          .exec();
      } else {
        // No plans match the search query, return an empty array
        users = [];
      }
    }

    // Return the users
    res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const constructSearchQuery = (queryParams) => {
  const constructedQuery = {};

  if (queryParams.freeUser && !queryParams.paidUser) {
    // If only freeUser is provided
    constructedQuery["plantype.amount"] = { $lte: 0 };
  } else if (queryParams.paidUser && !queryParams.freeUser) {
    // If only paidUser is provided
    constructedQuery["plantype.amount"] = { $gt: 0 };
  } else if (queryParams.freeUser && queryParams.paidUser) {
    // If both freeUser and paidUser are provided, handle as needed
    // Example: Fetch users that match either condition
    constructedQuery["$or"] = [
      { "plantype.amount": { $lte: 0 } },
      { "plantype.amount": { $gt: 0 } }
    ];
  }

  // No parameters or no specific filters
  return constructedQuery;
};

const Createsub = async (user, plan) => {
  try {
    if (!user || !plan) {
      throw new Error("User or plan not provided");
    }

    const stripeUser = await User.findById(user?._id);
    const stripePlan = await Plan.findById(plan);

    if (!stripeUser || !stripePlan) {
      throw new Error("User or plan not found");
    }

    console.log("Stripe User:", stripeUser);
    console.log("Stripe Plan:", stripePlan);

    const customer = await stripe.customers.create({
      phone: stripeUser?.phone_no,
    });

    const product = await stripe.products.create({
      name: stripePlan?.planname,
      type: "service",
    });

    const checkingPrices = await Promise.all(
      stripePlan?.plantype?.map(async (singlePlanType) => {
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: 20,
          recurring: {
            interval: "month",
          },
          product: product?.id,
        });
        return {
          price: price?.id,
        };
      })
    );

    console.log("Checking Prices:", checkingPrices);

    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: checkingPrices,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    let respond = {
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    };
    return respond;
  } catch (error) {
    console.error("Error:", error.message);
    // Handle error as per your application's requirements
  }
};

const deletedUser = async (req, res) => {
  const { id } = req?.params;
  if (!id) {
    throw new Error("id are not provided");
  }
  let deletedUser = await Uplan.findByIdAndDelete(id);
  return res.status(200).json({
    message: "user will be deleted sucessfully",
    deletedUser,
  });
};

module.exports = {
  createUserplan,
  getUserplan,
  deletedUser,
};
