import axios from 'axios';
import {Property, Inquiry, User} from '../../../database/models';
import {validateInquiry} from "../../../middleware/validate";
import {addToCache} from "../../../middleware/cache";
import headers from "../../../utils/headers";
const URL = "https://notification-ng.herokuapp.com";

/**
 * Inquiry controllers
 * @desc make inquiry, get inquiries, get inquiry, update inquiry, delete inquiry
 * */
class InquiryController {
    /**
     * @static
     * @desc  Make inquiry
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {string} message
     * */
    static async makeInquiry(req, res, next) {
        const {error} = validateInquiry(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, email, phone, message, user_id, property_id} = req.body;

        try {
            const inquiry = await Inquiry.build({
                name,
                email,
                phone,
                message,
                user_id,
                property_id
            });

            await inquiry.save();

            const user = await User.findByPk(user_id);

            const property = await Property.findByPk(property_id);

            const formData = {
                user_name: user.firstname,
                reference: property.reference,
                email: user.email,
                title: property.title,
                c_email: inquiry.email,
                message: inquiry.message,
                phone: inquiry.phone,
                customer_name: inquiry.name
            };

            await axios.post(`${URL}/api/v1/notification/inquiry`, formData, headers);

            return res.status(201).json({
                error: false,
                msg: 'Inquiry submitted successfully'
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get inquiries
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiries
     * */
    static async getInquiries(req, res, next) {
        try {
            const inquiries = await Inquiry.findAll({
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (inquiries.length < 1) return res.status(404).json({
                error: true,
                msg: 'No inquiry avalaible'
            });

            return res.status(200).json({
                error: false,
                inquiries
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get inquiry
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiries
     * */
    static async getInquiry(req, res, next) {
        try {
            const inquiry = await Inquiry.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (!inquiry) return res.status(404).json({
                error: true,
                msg: 'Inquiry not found'
            });

            // check if inquiry belongs to user
            if (req.user.id !== inquiry.user_id && req.user.role !== 'admin') return res.status(403).json({
                error: true,
                msg: 'Permission denied'
            });

            // Add to cache
            await addToCache(req.originalUrl, inquiry);

            return res.status(200).json({
                error: false,
                inquiry
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get user inquiries
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiries
     * */
    static async getUserInquiries(req, res, next) {
        try {
            const inquiries = await Inquiry.findAll({
                where: {
                    user_id: req.user.id
                },
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (inquiries.length < 1) return res.status(404).json({
                error: true,
                msg: 'No inquiry available'
            });

            return res.status(200).json({
                error: false,
                inquiries
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  View user inquiries
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiries
     * */
    static async viewUserInquiries(req, res, next) {
        try {
            const inquiries = await Inquiry.findAll({
                where: {
                    user_id: req.params.id
                },
                include: [
                    {
                        model: User
                    },
                    {
                        model: Property
                    }
                ]
            });

            if (inquiries.length < 1) return res.status(404).json({
                error: true,
                msg: 'No inquiry available'
            });

            return res.status(200).json({
                error: false,
                inquiries
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Update inquiry
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} inquiry
     * */
    static async updateInquiry(req, res, next) {
        const {error} = validateInquiry(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let inquiry = await Inquiry.findByPk(req.params.id);

            if (!inquiry) return res.status(404).json({
                error: true,
                msg: 'Inquiry not found'
            });

            await inquiry.update(req.body);

            inquiry = await Inquiry.findByPk(req.params.id, {
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
                inquiry
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Delete inquiry
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {string} success message
     * */
    static async deleteInquiry(req, res, next) {
        try {
            const inquiry = await Inquiry.findByPk(req.params.id);

            if (!inquiry) return res.status(404).json({
                error: true,
                msg: 'Inquiry not found'
            });

            await inquiry.destroy({force: true});

            return res.status(200).json({
                error: false,
                msg: 'Inquiry deleted successfully'
            });
        } catch (e) {
            next(e);
        }
    }
}

export default InquiryController;