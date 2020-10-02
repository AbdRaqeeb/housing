import {uploadImages} from 'cloudinary-simple-upload';
import {Property, PropertyInformation, PropertyLocation, User} from '../../../database/models';
import {validateProperty} from "../../../middleware/validate";
import folders from "../../../helpers/folders";
import db from '../../../database/models/index';
import {generateReference} from "../../../utils/reference";
import {addToCache} from "../../../middleware/cache";

/**
 * Property Controller
 * @desc add property, get all properties, get one property, get user properties, update property, delete property
 * */

class PropertyController {
    /**
     * @static
     * @desc    Add property
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} property
     * */
    static async addProperty(req, res, next) {
        const {error} = validateProperty(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {
            title,
            room,
            description,
            status,
            type,
            price,
            area,
            amenities,
            build_age,
            bathrooms,
            bq,
            address,
            city,
            state,
            country
        } = req.body;

        try {
            let property = await Property.findOne({
                where: {
                    title,
                    user_id: req.user.id,
                    type
                }
            });

            if (property) return res.status(400).json({
                error: true,
                msg: 'Property already added'
            });

            if (!req.files || Object.keys(req.files).length < 2) return res.status(400).json({
                error: true,
                msg: 'Please upload multiple images'
            });

            const images_url = await uploadImages(req.files.images, folders.properties);

            const images = await images_url.map(image_url => image_url.secure_url);

            property = await db.sequelize.transaction(async t => {
                const new_property = await Property.create({
                    user_id: req.user.id,
                    title,
                    room,
                    description,
                    status,
                    type,
                    price,
                    area,
                    amenities,
                    images,
                    reference: generateReference(6)
                }, {transaction: t});

                await PropertyLocation.create({
                    address,
                    city,
                    state,
                    country,
                    property_id: new_property.property_id
                }, {transaction: t});

                await PropertyInformation.create({
                    build_age,
                    bathrooms,
                    bq,
                    property_id: new_property.property_id
                }, {transaction: t});

                return new_property;
            });

            return res.status(201).json({
                error: false,
                msg: 'Property added successfully',
                property
            })
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get all properties
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} properties
     * */
    static async getProperties(req, res, next) {
        try {
            const properties = await Property.findAll({
                include: [
                    {
                        model: PropertyInformation
                    },
                    {
                        model: PropertyLocation
                    },
                    {
                        model: User
                    }
                ]
            });

            if (properties.length < 1) return res.status(404).json({
                error: true,
                msg: 'No properties available'
            });

            // Add response to cache
            await addToCache(req.originalUrl, properties);

            return res.status(200).json({
                error: false,
                properties
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get one property
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} properties
     * */
    static async getProperty(req, res, next) {
        try {
            const property = await Property.findByPk(req.params.id, {
                include: [
                    {
                        model: PropertyLocation
                    },
                    {
                        model: PropertyInformation
                    },
                    {
                        model: User
                    }
                ]
            });

            if (!property) return res.status(404).json({
                error: true,
                msg: 'Property not found'
            });

            // Add to cache
            await addToCache(req.originalUrl, property);

            return res.status(200).json({
                error: false,
                property
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Get User properties
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} properties
     * */
    static async getUserProperties(req, res, next) {
        try {
            const properties = await Property.findAll({
                where: {
                    user_id: req.user.id
                },
                include: [
                    {
                        model: PropertyInformation
                    },
                    {
                        model: PropertyLocation
                    }
                ]
            });

            if (properties.length < 1) return res.status(44).json({
                error: true,
                msg: 'No property available'
            });

            return res.status(200).json({
                error: false,
                properties
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  View user properties
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} properties
     * */
    static async viewUserProperties(req, res, next) {
        try {
            const properties = await Property.findAll({
                where: {
                    user_id: req.params.id
                },
                include: [
                    {
                        model: PropertyInformation
                    },
                    {
                        model: PropertyLocation
                    }
                ]
            });

            // Add to cache
            await addToCache(req.originalUrl, properties);

            if (properties.length < 1) return res.status(44).json({
                error: true,
                msg: 'No property available'
            });

            return res.status(200).json({
                error: false,
                properties
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Update property
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} property
     * */
    static async updateProperty(req, res, next) {
        const {error} = validateProperty(req.body, "update");
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let property = await Property.findByPk(req.params.id, {
                include: [
                    {
                        model: PropertyLocation
                    },
                    {
                        model: PropertyInformation
                    }
                ]
            });

            if (!property) return res.status(404).json({
                error: true,
                msg: 'Property not found'
            });

            if (req.user.id !== property.user_id && req.user.role !== 'admin') return res.status(403).json({
                error: true,
                msg: 'Permission denied'
            });


            // Check if photo was uploaded
            const images_url = req.files ? await uploadImages(req.files.images, folders.properties) : null;

            const images = (images_url !== null) ? await images_url.map(image_url => image_url.secure_url) : property.images;

            const data = req.body;

            // Added images to request.body
            data.images = images;

            property = await property.update(data);

            return res.status(200).json({
                error: false,
                msg: 'Property updated successfully',
                property
            });

        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  show property on front page slider
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} property
     * */
    static async paidProperty(req, res, next) {
        const {isPaid} = req.body;
        try {
            let property = await Property.findByPk(req.params.id);

            if (!property) return res.status(404).json({
                error: true,
                msg: 'Property not found'
            });

            await property.update({isPaid});

            property = await Property.findByPk(req.params.id, {
                include: [
                    {
                        model: PropertyInformation
                    },
                    {
                        model: PropertyLocation
                    },
                    {
                        model: User
                    }
                ]
            });

            return res.status(200).json({
                error: false,
                msg: 'Property updated',
                property
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc  Delete property
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} property
     * */
    static async deleteProperty(req, res, next) {
        try {
            const property = await Property.findByPk(req.params.id);

            if (!property) return res.status(404).json({
                error: true,
                msg: 'Property not found'
            });

            await property.destroy({force: true});

            return res.status(200).json({
                error: false,
                msg: 'Property deleted successfully'
            });
        } catch (e) {
            next(e);
        }
    }
}

export default PropertyController;