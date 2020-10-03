import {User, Property, Review, Tour, Inquiry, Payment} from '../../../database/models';
import {addToCache} from "../../../middleware/cache";

/**
 * statisic controllers
 * @desc get users, get payments
 * */

class StatisticController {
    /**
     * @static
     * @desc  Get all users
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} users
     * */
    static async getUsers(req, res, next) {
        try {
            const users = await User.findAndCountAll({
                include: [
                    {
                        model: Property
                    },
                    {
                        model: Tour
                    },
                    {
                        model: Inquiry
                    },
                    {
                        model: Payment
                    }
                ]
            });

            if (users.length < 1) return res.status(404).json({
                error: true,
                msg: 'No users available'
            });

            // add to cache
            await addToCache(req.originalUrl, users);

            return res.status(200).json({
                error: false,
                users
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get all payments
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} payments
     * */
    static async getPayments(req, res, next) {
        try {
            const payments = await Payment.findAll({
                include: User
            });

            if (payments.length < 1) return res.status(404).json({
                error: true,
                msg: 'No payments available'
            });

            return res.status(200).json({
                error: false,
                payments
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get tour counts
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tours
     * */
    static async getTourCounts(req, res, next) {
        try {
            const tours = await Tour.findAndCountAll();

            if (!tours) return res.status(404).json({
                error: true,
                msg: 'No tour available'
            });

            return res.status(200).json({
                error: true,
                tours
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get inquiry counts
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiries
     * */
    static async getInquiryCounts(req, res, next) {
        try {
            const inquiries = await Inquiry.findAndCountAll();

            if (!inquiries) return res.status(404).json({
                error: true,
                msg: 'No inquiry available'
            });

            return res.status(200).json({
                error: true,
                inquiries
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get property counts
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} properties
     * */
    static async getPropertyCounts(req, res, next) {
        try {
            const properties = await Property.findAndCountAll();

            if (!properties) return res.status(404).json({
                error: true,
                msg: 'No property available'
            });

            return res.status(200).json({
                error: true,
                properties
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get review counts
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} reviews
     * */
    static async getReviewCounts(req, res, next) {
        try {
            const reviews = await Review.findAndCountAll();

            if (!reviews) return res.status(404).json({
                error: true,
                msg: 'No review available'
            });

            return res.status(200).json({
                error: true,
                reviews
            });
        } catch (e) {
            next(e);
        }
    }
}

export default StatisticController;