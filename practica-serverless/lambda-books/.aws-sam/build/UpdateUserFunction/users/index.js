const statusCodes = require('../config/statusCodes.js');
const usersDbManager = require('./dbManager.js');
const buildResponse = require('../config/buildResponse.js');

const getAllUsersHandler = async () => {
    const usersResponse = await usersDbManager.getAllUsers();
    return buildResponse(statusCodes.OK, usersResponse);
};

const getUserHandler = async req => {
    const { userId } = req.pathParameters;
    try {
        const userResponse = await usersDbManager.getUser(userId);
        if (!userResponse) {
            return buildResponse(statusCodes.NOT_FOUND);
        }
        return buildResponse(statusCodes.OK, userResponse);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const createUserHandler = async req => {
    const { nick, email } = JSON.parse(req.body);
    const existingUser = await usersDbManager.getUserByNick(nick);

    if (existingUser) {
        return buildResponse(statusCodes.CONFLICT);
    }

    try {
        const userResponse = await usersDbManager.createUser(nick, email);
        if (!userReponse) {
            return buildResponse(statusCodes.NOT_FOUND);
        }
        return buildResponse(statusCodes.OK, userResponse);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const updateUserHandler = async req => {
    const { userId } = req.pathParameters;
    const { email } = JSON.parse(req.body);
    try {
        const userReponse = await usersDbManager.updateUser(userId, email);
        if (!userReponse) {
            return buildResponse(statusCodes.NOT_FOUND);
        }
        return buildResponse(statusCodes.OK, userResponse);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const deleteUserHandler = async req => {
    const { userId } = req.pathParameters;
    try {
        const userReponse = await usersDbManager.deleteUser(userId, email);
        if (!userReponse) {
            return buildResponse(statusCodes.NOT_FOUND);
        }
        return buildResponse(statusCodes.OK, userResponse);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

module.exports = {
    getAllUsersHandler,
    getUserHandler,
    createUserHandler,
    updateUserHandler,
    deleteUserHandler
};
