import {Review, Property} from '../../../database/models';
import {validateReview} from "../../../middleware/validate";
import {addToCache} from "../../../middleware/cache";

/**
 * Review controllers
 * @desc add review, get reviews, get review, get property reviews, delete review
 * */
class ReviewController {
    /**
     * @static
     * @desc  add review
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} review
     * */
    static async addReview(req, res, next) {
        const {error} = validateReview(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {message, name, email, rating, property_id} = req.body;

        try {
            let review = await Review.build({
                name,
                message,
                rating,
                property_id,
                email
            });

            await review.save();

            return res.status(200).json({
                error: false,
                review
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  get reviews
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} reviews
     * */
    static async getReviews(req, res, next) {
        try {
            const reviews = await Review.findAll({
                include: Property
            });

            if (reviews.length < 1) return res.status(404).json({
                error: true,
                msg: 'No reviews available'
            });

            return res.status(200).json({
                error: false,
                reviews
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  get review
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} review
     * */
    static async getReview(req, res, next) {
        try {
            const review = await Review.findByPk(req.params.id, {
                include: Property
            });

            if (!review) return res.status(404).json({
                error: true,
                msg: 'Review not found'
            });

            // add to cache
            await addToCache(req.originalUrl, review);

            return res.status(200).json({
                error: false,
                review
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  get user reviews
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} reviews
     * */
    static async getPropertyReviews(req, res, next) {
        try {
            const reviews = await Review.findAll({
                where: {
                    property_id: req.params.id
                }
            });

            if (reviews.length < 1) return res.status(404).json({
                error: true,
                msg: 'No review available'
            });

            return res.status(200).json({
                error: false,
                reviews
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  delete review
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {string} success message
     * */
    static async deleteReview(req, res, next) {
        try {
            const review = await Review.findByPk(req.params.id);

            if (!review) return res.status(404).json({
                error: true,
                msg: 'Review not found'
            });

            await review.destroy({force: true});

            return res.status(200).json({
                error: false,
                msg: 'Review deleted successfully'
            });
        } catch (e) {
            next(e);
        }
    }
}

export default ReviewController;