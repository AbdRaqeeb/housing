import bcrypt from 'bcryptjs';
import axios from 'axios';
import {verify} from 'jsonwebtoken';
import {User} from '../../../database/models';
import {validateUser, validatePassword, validatePasswordReset} from "../../../middleware/validate";
import {generateToken, generateTokenReset} from "../../../middleware/token";
import folders from "../../../helpers/folders";
import {uploadImage} from 'cloudinary-simple-upload';
import headers from "../../../utils/headers";
const URL = "https://notification-ng.herokuapp.com";

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

            const payload = {
                id: user.user_id
            };

            const token = generateToken(payload, process.env.JWT_ACTIVATE_ACCOUNT);

            const formData = {
                email: user.email,
                token
            };

            await axios.post(`${URL}/api/v1/notification/verify`, formData, headers);

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
        const {token} = req.params;
        try {
            await verify(token, process.env.JWT_ACTIVATE_ACCOUNT, async (err, decoded) => {
                if (err) return res.status(400).json({
                    error: true,
                    msg: 'Incorrect or expired link'
                });

                const {id} = decoded;
                let user = await User.findByPk(id);

                await user.update({isVerified: true});

                return res.status(200).json({
                    error: false,
                    msg: 'Email verified successfully'
                })
            });
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
     * @returns {object} reset token and email
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

            const payload = {
                id: user.user_id
            };

            const token = generateTokenReset(payload, process.env.JWT_RESET_PASSWORD);

            const formData = {
                token,
                email: user.email
            };

            await axios.post(`${URL}/api/v1/notification/password`, formData, headers);


            await user.update({
                resetLink: token
            });

            return res.status(200).json({
                error: false,
                msg: 'Password reset link has been sent to your email...'
            });


        } catch (e) {
            next(e);
        }
    }


    /**
     * @static
     * @desc    Reset password
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @access Private
     * */
    static async resetPassword(req, res, next) {
        const {error} = validatePasswordReset(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {password} = req.body;
        const {token} = req.params;

        try {
            if (!token) return res.status(400).json({
                error: true,
                msg: 'Authentication error'
            });

            await verify(token, process.env.JWT_RESET_PASSWORD, async (err, decoded) => {
               if (err) return res.status(401).json({
                   error: true,
                   msg: 'Invalid or expired token'
               });

               const user = await User.findOne({
                   where: {
                       resetLink: token
                   }
               });

               if (!user) return res.status(400).json({
                   error: true,
                   msg: 'Account not found'
               });

                // Hash password before saving
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(password, salt);


               await user.update({
                   password: hashPassword
               });

               return res.status(200).json({
                   error: false,
                   msg: 'Password changed successfully'
               });
            });
        } catch (e) {
            next(e);
        }
    }

}

export default UserController
