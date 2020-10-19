import {Tour, Payment, User, Property} from '../../../database/models';
import {validateTour} from "../../../middleware/validate";
import {addToCache} from "../../../middleware/cache";
import db from '../../../database/models/index';

/**
 * Tour controllers
 * @desc book tour, get tours, get tour, get user tours, update tour, delete tour
 * */
class TourController {
    /**
     * @static
     * @desc  Book tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {string} message
     * */
    static async bookTour(req, res, next) {
        const {error} = validateTour(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, email, phone, date, time, user_id, property_id} = req.body;

        try {
            const new_tour = await db.sequelize.transaction(async t => {
                const tour = await Tour.create({
                    name,
                    email,
                    phone,
                    date,
                    time,
                    user_id,
                    property_id,
                    charges: 10.00
                }, {transaction: t});

                await Payment.create({
                    amount: tour.charges,
                    tour_id: tour.id,
                    user_id: tour.user_id,
                    property_id: tour.property_id
                }, {transaction: t});

                return tour;
            });

            return res.status(201).json({
                error: false,
                msg: 'Tour booked successfully',
                new_tour
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get all tours
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tours
     * */
    static async getTours(req, res, next) {
        try {
            const tours = await Tour.findAll({
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (tours.length < 1) return res.status(404).json({
                error: true,
                msg: 'No tours available'
            });

            return res.status(200).json({
                error: false,
                tours
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get one tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tour
     * */
    static async getTour(req, res, next) {
        try {
            const tour = await Tour.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (!tour) return res.status(404).json({
                error: true,
                msg: 'Tour not found'
            });

            // check if tour belongs to user
            if (req.user.id !== tour.user_id && req.user.role !== 'admin') return res.status(403).json({
                error: true,
                msg: 'Permission denied'
            });

            // add to cache
            await addToCache(req.originalUrl, tour);

            return res.status(200).json({
                error: true,
                tour
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get user tours
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tours
     * */
    static async getUserTours(req, res, next) {
        try {
            const tours = await Tour.findAll({
                where: {
                    user_id: req.user.id
                },
                include: Property
            });

            if (tours.length < 1) return res.status(404).json({
                error: true,
                msg: 'No tour available'
            });

            return res.status(200).json({
                error: false,
                tours
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  View user tours
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tours
     * */
    static async viewUserTours(req, res, next) {
        try {
            const tours = await Tour.findAll({
                where: {
                    user_id: req.params.id
                },
                include: Property
            });

            if (tours.length < 1) return res.status(404).json({
                error: true,
                msg: 'No tour available'
            });

            return res.status(200).json({
                error: false,
                tours
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Update tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tour
     * */
    static async updateTour(req, res, next) {
        const {error} = validateTour(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let tour = await Tour.findByPk(req.params.id);

            if (!tour) return res.status(404).json({
                error: true,
                msg: 'Tour not found'
            });

            await tour.update(req.body);

            tour = await Tour.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            return res.status(200).json({
                error: false,
                tour
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Accept tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tour
     * */
    static async acceptTour(req, res, next) {
        try {
            let tour = await Tour.findByPk(req.params.id);

            if (!tour) return res.status(404).json({
                error: true,
                msg: 'Tour not found'
            });

            if (req.user.id !== tour.user_id && req.user.role !== 'admin') return res.status(403).json({
               msg: 'Permission denied'
            });

            await tour.update({isAvailable: true});

            tour = await Tour.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            return res.status(200).json({
                error: false,
                tour
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Reject tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} tour
     * */
    static async rejectTour(req, res, next) {
        try {
            let tour = await Tour.findByPk(req.params.id);

            if (!tour) return res.status(404).json({
                error: true,
                msg: 'Tour not found'
            });

            if (req.user.id !== tour.user_id && req.user.role !== 'admin') return res.status(403).json({
                msg: 'Permission denied'
            });

            await tour.update({isAvailable: false});

            tour = await Tour.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            return res.status(200).json({
                error: false,
                tour
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Delete tour
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {string} success message
     * */
    static async deleteTour(req, res, next) {
        try {
            const tour = await Tour.findByPk(req.params.id);

            if (!tour) return res.status(404).json({
                error: true,
                msg: 'Tour not found'
            });

            await tour.destroy({force: true});

            return res.status(200).json({
                error: false,
                msg: 'Tour deleted successfully'
            });
        } catch (e) {
            next(e);
        }
    }
}

export default TourController;