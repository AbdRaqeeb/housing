import bcrypt from 'bcryptjs';
import {User, Admin, Inquiry, Property, Tour} from '../../../database/models';
import {validateLogin} from "../../../middleware/validate";
import {generateToken} from "../../../middleware/token";

/**
 *Auth controllers
 *@desc get logged in user and admin, login user and admin
 **/
class AuthController {
    /**
     * @static
     * @desc  Login user
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {token} access token
     * @access Public
     * */
    static async loginUser(req, res, next) {
        const {error} = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {username, password} = req.body;

        try {
            const user = await User.findOne({
                where: {
                    username
                }
            });

            if (!user) return res.status(404).json({
                error: true,
                msg: 'Invalid username'
            });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({
                error: true,
                msg: 'Invalid password'
            });

            const payload = {
                id: user.user_id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                error: false,
                token
            });

        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Login admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {token} access token
     * @access Public
     * */
    static async loginAdmin(req, res, next) {
        const {error} = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {username, password} = req.body;

        try {
            const admin = await Admin.findOne({
                where: {
                    username
                }
            });

            if (!admin) return res.status(404).json({
                error: true,
                msg: 'Invalid username'
            });

            const validPassword = bcrypt.compareSync(password, admin.password);

            if (!validPassword) return res.status(400).json({
                error: true,
                msg: 'Invalid password'
            });

            const payload = {
                id: admin.admin_id,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                role: admin.role
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                error: false,
                token
            });

        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Get Logged in admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next {function}
     * @returns {object} user profile
     * @access Private
     * */
    static async loggedAdmin(req, res, next) {
        try {
            const admin = await Admin.findByPk(req.user.id);

            res.status(200).json({
                error: false,
                admin
            });

        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Get Logged in user
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} user profile
     * @access Private
     * */
    static async loggedUser(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [
                    {
                        model: Inquiry
                    },
                    {
                        model: Tour
                    },
                    {
                        model: Property
                    }
                ]
            });

            res.status(200).json({
                error: false,
                user
            });
        } catch (e) {
            next(e);
        }
    }

}

export default AuthController;
