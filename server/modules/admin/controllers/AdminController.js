import bcrypt from 'bcryptjs';
import {Admin} from '../../../database/models';
import {validateAdmin, validatePassword} from "../../../middleware/validate";
import {generateToken} from "../../../middleware/token";
import {uploadImage} from 'cloudinary-simple-upload';
import folders from "../../../helpers/folders";

/**
 * Admin controller class
 * @desc Admin registeration, change pasword, update profile
 * */
class AdminController {
    /**
     * @static
     * @desc Register admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @param next
     * @returns {token} access token
     * */
    static async registerAdmin(req, res, next) {
        const {error} = validateAdmin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {username, firstname, lastname, email, password} = req.body;

        try {
            let admin = await Admin.findOne({
                where: {
                    username
                }
            });

            if (admin) return res.status(400).json({
                error: true,
                msg: 'Admin already exists'
            });

            admin = Admin.build({
                username,
                firstname,
                lastname,
                email,
                password
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            admin.password = bcrypt.hashSync(password, salt);

            await admin.save();

            const payload = {
                id: admin.admin_id,
                firstname: admin.firstname,
                lastname: admin.lastname,
                role: admin.role,
                email: admin.email
            };

            // generate token
            const token = generateToken(payload, process.env.JWT_SECRET);

            res.status(201).json({
                error: false,
                token
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
     * @returns {object} admin profile
     * @access Private
     * */
    static async uploadProfilePhoto(req, res, next) {
        if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
            error: true,
            msg: 'Please upload an image'
        });

        const image = await uploadImage(req.files.image, folders.admin, 'owner');


        try {
            let admin = await Admin.findByPk(req.user.id);

            await admin.update({image});

            admin = await Admin.findByPk(req.user.id);


            return res.status(200).json({
                error: false,
                msg: 'User updated successfully',
                admin
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
        const {error} = validateAdmin(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let admin = await Admin.findByPk(req.user.id);

            admin = await admin.update(req.body);

            return res.status(200).json({
                error: false,
                msg: 'Profile updated successfully',
                admin
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
            const admin = await Admin.findByPk(req.user.id);

            const validPassword = bcrypt.compareSync(old_password, admin.password);

            if (!validPassword) return res.status(400).json({
                error: true,
                msg: 'Password mismatch'
            });

            const salt = bcrypt.genSaltSync(10);
            admin.password = bcrypt.hashSync(new_password, salt);

            await admin.save();

            return res.status(200).json({
                error: false,
                msg: 'Password changed successfully'
            });

        } catch (e) {
            next(e);
        }

    }
}

export default AdminController;