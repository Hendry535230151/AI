const userModel = require('../models/Users');
const customError = require('../errors/CustomError');

const userService = {
    getUsers: async () => {
        try {
            const fetchAll = await userModel.getUsers();
            if (!fetchAll || fetchAll.length === 0) {
                throw new customError('No users found. Please ensure the database is correctly populated and try again.', 404);
            }

            return fetchAll;
        } catch (err) {
            throw err;
        }
    },

    getUserById: async (id) => {
        try {
            if (!id) {
                throw new customError('User ID is required. Please provide a valid ID and try again.', 400);
            }
            
            const findUser = await userModel.getUserById(id);
            if (!findUser) {
                throw new customError(`No user found with ID: ${id}. Please verify the ID and try again.`, 404);
            }

            return findUser;
        } catch (err) {
            throw err;
        }
    },

    getUserByEmail: async (email) => {
        try {
            if (!email) {
                throw new customError('Email address is required. Please provide a valid email and try again.', 400);
            }
            const findUser = await userModel.getUserByEmail(email);
            if (!findUser) {
                throw new customError(`No user found with email: ${email}. Please verify the email and try again.`, 404);
            }

            return findUser;
        } catch (err) {
            throw err;
        }
    },

    getUserByName: async (name) => {
        try {
            if (!name) {
                throw new customError('Name is required. Please provide a valid name and try again', 400);
            }

            const findUser = await userModel.getUserByName(name);
            if (!findUser) {
                throw new customError(`No user found with the name: ${name}. Please ensure the name is correctly spelled and try again.`, 404);
            }

            return findUser;
        } catch (err) {
            throw err;
        }
    },

    deleteById: async (id) => {
        try {
            if (!id) {
                throw new customError('User ID is required. Please provide a valid ID and try again', 400);
            }

            const findUser = await userModel.getUserById(id);
            if (!findUser) {
                throw new customError(`User with ID: ${id} not found. Please verify the ID and try again.`, 400);
            } 
            const deleteUser = await userModel.deleteById(id);
            if (!deleteUser) {
                throw new customError(`Failed to delete user with ID: ${id}. The user may not exist. Please verify the ID and try again.`, 400);
            }

            return deleteUser;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = userService;