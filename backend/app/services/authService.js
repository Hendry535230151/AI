require('dotenv').config();
const userModel = require('../models/Users');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customError = require('../errors/CustomError');
const format = require('../utils/formatValidation');

const authService = {
    userLogin: async (email, password) => {
        try {
            if (!email) {
                throw new customError('Email address is required. Please provide a valid email and try again.', 400);
            } else if (!password) {
                throw new customError('Password is required. Please provide a valid password and try again.', 400);
            } 

            if (!format.isValidEmail(email)) {
                throw new customError('Invalid email format. Please check and try again', 400);
            } else if (!format.isValidPassword(password)) {
                throw new customError('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.',400);
            }

            const user = await userModel.getUserByEmail(email);
            if (!user) {
                throw new customError(`No user found with email: ${email}. Please verify the email and try again.`, 404);
            };

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new customError('Passwords do not match. Please try another password.', 400);
            };

            const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
            return token;
        } catch (err) {
            throw err;
        }
    },

    userLogup: async (firstName, lastName, email, password, passwordConfirm) => {
        try {
            if (!firstName) {
                throw new customError('First name is required. Please provide a valid name and try again', 400);
            } else if (!lastName) {
                throw new customError('Last name is required. Please provide a valid name and try again', 400);
            } else if (!email) {
                throw new customError('Email address is required. Please provide a valid email and try again.', 400);
            } else if (!password) {
                throw new customError('Password is required. Please provide a valid password and try again.', 400);
            } else if (!passwordConfirm) {
                throw new customError('Password confirm is required. Please provide a valid password confirm and try again.', 400);
            }

            if (!format.isValidEmail(email)) {
                throw new customError('Invalid email format. Please check and try again', 400);
            } else if (!format.isValidPassword(password)) {
                throw new customError('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.',400);
            } else if (password !== passwordConfirm) {
                throw new customError('Passwords do not match. Please make sure both passwords are the same.', 400);
            }

            const user = await userModel.getUserByEmail(email);
            if (user) {
                throw new customError(`User with email: ${email} already exists. Please use a different email.`, 409);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const createUser = await userModel.createUser(firstName, lastName, email, hashedPassword);
            if (!createUser) {
                throw new customError('Failed to create user. Please try again later.', 500);
            }

            return createUser;
        } catch (err) {
            throw err;
        }
    },  

    requestPasswordReset: async (email) => {
        try {
            if (!email) {
                throw new customError('Email address is required. Please provide a valid email and try again.', 400);
            }

            if (!format.isValidEmail(email)) {
                throw new customError('Invalid email format. Please check and try again', 400);
            }

            const user = await userModel.getUserByEmail(email);
            if (!user) {
                throw new customError(`No user found with email: ${email}. Please verify the email and try again.`, 404);
            }

            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
            const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

            const html = `
                <h3>Password Reset Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 15 minutes.</p>
            `;

            await sendEmail(email, 'Password Reset', html);

            return { message: 'Reset email sent successfully.' };
        } catch (err) {
            throw err;
        }
    },

    updatePassword: async (token, password, passwordConfirm) => {
        try {
            if (!token) {
                throw new customError('Token is required. Please provide a valid token and try again.', 400);
            } else if (!password) {
                throw new customError('Password is required. Please provide a valid password and try again.', 400);
            } else if (!passwordConfirm) {
                throw new customError('Password confirm is required. Please provide a valid password confirm and try again.', 400);
            }
            
            if (!format.isValidPassword(password)) {
                throw new customError('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.',400);
            } else if (password !== passwordConfirm) {
                throw new customError('Passwords do not match. Please make sure both passwords are the same.', 400);
            }
    
            let payload;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            } catch (err) {
                throw new customError('Invalid or expired token. Please provide a valid token and try again.', 401);
            }
    
            const user = await userModel.getUserByEmail(payload.email);
            if (!user) {
                throw new customError(`No user found with email: ${email}. Please verify the email and try again.`, 404);
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const result = await userModel.updatePassword(user.email, hashedPassword);
            if (!result) {
                throw new customError('Failed to update password. Please try again later', 500);
            }
    
            return { message: 'Password updated successfully.' };
        } catch (err) {
            throw err;
        }
    }    
};

module.exports = authService;