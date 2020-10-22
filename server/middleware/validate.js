import Joi from 'joi';

export function validateAdmin(admin, key) {
    const schema = Joi.object({
        username: key ? Joi.string().max(30).optional() : Joi.string().max(30).required(),
        firstname: key ? Joi.string().optional() : Joi.string().required(),
        lastname: key ? Joi.string().optional() : Joi.string().required(),
        email: key ? Joi.string().optional().email() : Joi.string().required().email(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        password: key ? Joi.string().optional().min(6) : Joi.string().required().min(6),
        image: Joi.any().optional()
    });
    return schema.validate(admin);
}

export function validateUser(user, key) {
    const schema = Joi.object({
        username: key ? Joi.string().max(30).optional() : Joi.string().max(30).required(),
        firstname: key ? Joi.string().optional() : Joi.string().required(),
        lastname: key ? Joi.string().optional() : Joi.string().required(),
        email: key ? Joi.string().optional().email() : Joi.string().required().email(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        password: key ? Joi.string().optional().min(6) : Joi.string().required().min(6),
        image: Joi.any().optional(),
        about: Joi.string().optional()
    });
    return schema.validate(user);
}

export function validateInquiry(inquiry) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        message: Joi.string().required(),
        user_id: Joi.string().required(),
        property_id: Joi.string().required()
    });
    return schema.validate(inquiry)
}

export function validateReview(review) {
    const schema = Joi.object({
        rating: Joi.number().required(),
        name: Joi.string().required(),
        message: Joi.string().required(),
        email: Joi.string().email().required(),
        property_id: Joi.number().required()
    });
    return schema.validate(review);
}

export function validateTour(tour, key) {
    const schema = Joi.object({
        name:key ? Joi.string().optional() : Joi.string().required(),
        email:key ? Joi.string().optional() : Joi.string().required(),
        phone:key ? Joi.string().optional() : Joi.string().required(),
        date:key ? Joi.string().optional() : Joi.string().required(),
        time:key ? Joi.string().optional() : Joi.string().required(),
        user_id:key ? Joi.number().optional() : Joi.number().required(),
        property_id:key ? Joi.number().optional() : Joi.number().required()
    });
    return schema.validate(tour);
}

export function validateProperty(property, key) {
    const schema = Joi.object({
        title: key ? Joi.string().optional() : Joi.string().required(),
        description: Joi.string().optional(),
        status: Joi.string().optional(),
        room: key ? Joi.number().optional() : Joi.string().required(),
        type: Joi.string().optional(),
        price: key ? Joi.number().optional() : Joi.number().required(),
        area: key ? Joi.string().optional() : Joi.string().required(),
        amenities: key ? Joi.array().optional() : Joi.array().required(),
        isAvailable: Joi.boolean().optional(),
        images: Joi.any().optional(),
        isPaid: Joi.boolean().optional(),
        build_age: key ? Joi.string().optional() : Joi.string().required(),
        bathrooms: key ? Joi.number().optional() : Joi.number().required(),
        bedrooms: key ? Joi.number().optional() : Joi.number().required(),
        bq: key ? Joi.boolean().optional() : Joi.boolean().required(),
        address: key ? Joi.string().optional() : Joi.string().required(),
        city: key ? Joi.string().optional() : Joi.string().required(),
        state: key ? Joi.string().optional() : Joi.string().required(),
        country: key ? Joi.string().optional() : Joi.string().required()
    });
    return schema.validate(property);
}

export function validatePassword(password) {
    const schema = Joi.object({
        old_password: Joi.string().min(6).required(),
        new_password: Joi.string().min(6).required()
    });
    return schema.validate(password);
}

export function validatePasswordReset(password) {
    const schema = Joi.object({
        password: Joi.string().min(6).required()
    });
    return schema.validate(password);
}

export function validateLogin(user) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required().min(6)
    });
    return schema.validate(user);
}