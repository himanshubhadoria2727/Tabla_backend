

const Plan = require("../../model/plan.model");
const planSchema = require("./plan.dto");




const addPlan = async (req, res) => {
    try {
        const { error } = planSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { planname, description, plantype } = req.body
        let savedPlan = await Plan.create({
            planname: planname,
            description: description,
            plantype: plantype
        })
        return res.status(201).json({ message: 'Plan created successfully', plan: savedPlan });




    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "Invalid server error"
        })
    }

}

const getPlan = async (req, res) => {
    try {
        const query = constructSearchQuery(req.query);
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;



        let allPlan = await Plan.find(query).skip(skip).limit(pageSize)
        const total = await Plan.countDocuments(query)
        const planRespond = {
            data: allPlan,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),


            }

        }
        return res.status(200).json(planRespond)
    } catch (err) {
        console.error(err)

    }
}

const constructSearchQuery = (queryParms) => {
    const constructedQuery = {}
    if (queryParms.startdate && queryParms.enddate) {
        const startDate = new Date(queryParms.startdate);
        const endDate = new Date(queryParms.enddate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date strings for startdate or enddate.');
            return constructedQuery;  // Return an empty query or handle the error as needed
        }

        endDate.setHours(23, 59, 59, 999);

        constructedQuery.makeAt = {
            $gte: startDate,
            $lte: endDate
        };

    }
    if (queryParms.freeUser) {
        constructedQuery['plantype.amount'] = { $lte: 0 };
    }
    if (queryParms.paidUser) {
        constructedQuery['plantype.amount'] = { $gt: 0 };
    }
    return constructedQuery;
}
const deletedPlan = async (req, res) => {
    try {
        let id = req.params.id
        if (!id) {
            return res.status(500).json({ "message": "Id is not found" })
        }
        let deletedPan = await Plan.findByIdAndDelete(id)
        return res.status(200).json({ "message": "plan will be deleted sucessfully", deletedPan })

    } catch (err) {
        console.log(err)
        return res.json({
            "message": "Internal server error"
        })
    }
}

module.exports = {
    addPlan, getPlan, deletedPlan
}