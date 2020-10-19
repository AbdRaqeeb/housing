import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {User, ResetToken} from '../../../database/models';
import {validateUser, validatePassword} from "../../../middleware/validate";
import folders from "../../../helpers/folders";
import {uploadImage} from 'cloudinary-simple-upload';


/**
 * User Controller
 * @desc register user, update profile, upload profile photo, change password
 * */
class UserController {
    /**
     * @static
     * @desc    Register a customer
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {token} access token
     * @access Public
     * */
    static async registerUser(req, res, next) {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {firstname, lastname, username, email, password} = req.body;

        try {
            let user = await User.findOne({
                where: {
                    email
                }
            });

            if (user) return res.status(400).json({
                error: true,
                msg: 'User already exists'
            });

            user = User.build({
                firstname,
                email,
                lastname,
                username,
                password,
                role: 'user'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            res.status(200).json({
                error: false,
                msg: 'User registered successfully, please verify your email'
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Upload profile image
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} user profile
     * @access Private
     * */
    static async uploadProfilePhoto(req, res, next) {
        if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
            error: true,
            msg: 'Please upload an image'
        });

        const image = await uploadImage(req.files.image, folders.users, 'owner');
        try {
            let user = await User.findByPk(req.user.id);

            await user.update({image});

            user = await User.findByPk(user.user_id);

            return res.status(200).json({
                error: false,
                msg: 'User updated successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Update profile
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} user profile
     * @access Private
     * */
    static async updateProfile(req, res, next) {
        const {error} = validateUser(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let user = await User.findByPk(req.user.id);

            await user.update(req.body);

            user = await User.findByPk(user.user_id);

            return res.status(200).json({
                error: false,
                msg: 'Profile updated successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc    Verify Email
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} verify email
     * @access Private
     * */
    static async verifyEmail(req, res, next) {
        try {
            let user = await User.findByPk(req.params.id);

            await user.update({isVerified: true});

            return res.status(200).json({
                error: false,
                msg: 'Email verified successfully'
            })
        } catch (e) {
            next(e);
        }
    }

    /**
     * @static
     * @desc   Change password
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} user profile
     * @access Private
     * */
    static async changePassword(req, res, next) {
        const {error} = validatePassword(req.body);
        if (error) return res.status(400).json(error.details[0].message);


        const {old_password, new_password} = req.body;
        try {
            const user = await User.findByPk(req.user.id);

            const validPassword = bcrypt.compareSync(old_password, user.password);

            if (!validPassword) return res.status(400).json({
                error: true,
                msg: 'Password mismatch'
            });

            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(new_password, salt);

            await user.save();

            return res.status(200).json({
                error: false,
                msg: 'Password changed successfully',
            });

        } catch (e) {
            next(e);
        }

    }

    /**
     * @static
     * @desc    Forgot password
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {object} user profile
     * @access Private
     * */
    static async forgotPassword(req, res, next) {
        const {email} = req.body;

        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (!user) return res.status(200).json({
                msg: 'OK'
            });

            await ResetToken.update({
                used: 1
            }, {
                where: {
                    email: user.email
                }
            });

            // create token
            const token = await crypto.randomBytes(64).toString('base64');

            //token expires after one hour
            const expiration = new Date();
            expiration.setDate(expiration.getDate() + 1/24);

            await ResetToken.create({
                used: 0,
                token,
                expiration,
                email
            });

        } catch (e) {
            next(e);
        }
    }

}

export default UserController
