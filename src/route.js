const userRoute = require("./modules/user.route");
const planRoute = require("./modules/plan/plan.route");
const userPlan = require("./modules/user_plan/user.route");

const contentRoute = require("./modules/content/content.route");
const categoryRoute = require("./modules/category/category.route");
const subcategoryRoute = require("./modules/subcategory/subcategory.route");
const tablaRouter = require("./modules/tabla/tabla.route");
const tanpuraRouter = require("./modules/tanpura/tanpura.route");
const surmandalRouter = require("./modules/surmandal/surmandal.route");
const surpetiRouter = require("./modules/surpeti/surpeti.route");

const registerRoute = (app) => {
 
  app.use("/api/user", userRoute);
  app.use("/api/plan", planRoute);
  app.use("/api", userPlan);
  app.use("/api/content", contentRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/subcategory", subcategoryRoute);
  app.use("/api/tabla", tablaRouter);
  app.use("/api/tanpura", tanpuraRouter);
  app.use("/api/surmandalRouter", surmandalRouter);
  app.use("/api/surpetiRouter", surpetiRouter);
};

module.exports = {
  registerRoute,
};
