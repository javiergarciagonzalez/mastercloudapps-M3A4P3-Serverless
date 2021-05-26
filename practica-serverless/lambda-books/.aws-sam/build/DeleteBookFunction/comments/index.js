const commentsDbManager = require('./dbManager.js');
const booksDbManager = require('../books/dbManager.js');
const usersDbManager = require('../users/dbManager.js');
const buildResponse = require('../config/buildResponse.js');
const statusCodes = require('../config/statusCodes.js');

const getUserCommentsHandler = async req => {
    const { userId } = req.pathParameters;
    const comments = await commentsDbManager.getUserComments(userId);
    return buildResponse(statusCodes.OK, comments);
};

const getBookCommentsHandler = async req => {
    const { userId } = req.pathParameters;
    const comments = await commentsDbManager.getUserComments(userId);
    return buildResponse(statusCodes.OK, comments);
};

const createCommentHandler = async req => {
    const { userNick, comment, score } = JSON.parse(req.body);
    const { bookId } = req.pathParameters;
    const userResponse = await usersDbManager.getUserByNick(userNick);
    const bookResponse = await booksDbManager.getBook(bookId);

    if (!userResponse || !bookResponse) {
        return buildResponse(statusCodes.NOT_FOUND);
    }

    const { id: userId } = userResponse;

    try {
        const { id: commentId } = await commentsDbManager.createComment(
            userId,
            bookId,
            comment,
            score
        );
        return buildResponse(statusCodes.CREATED, {
            id: commentId,
            user: userNick,
            comment,
            score
        });
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const updateCommentHandler = async req => {
    const { commentId, bookId } = req.pathParameters;
    try {
        const updatedComment = await commentsDbManager.updateComment(
            bookId,
            commentId
        );

        if (!updatedComment) {
            return buildResponse(statusCodes.NOT_FOUND);
        }

        return buildResponse(statusCodes.OK, updatedComment);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const deleteCommentHandler = async req => {
    const { commentId, bookId } = req.pathParameters;
    try {
        const deletedComment = await commentsDbManager.deleteComment(
            bookId,
            commentId
        );

        if (!deletedComment) {
            return buildResponse(statusCodes.NOT_FOUND);
        }

        return buildResponse(statusCodes.OK, deletedComment);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

module.exports = {
    getUserCommentsHandler,
    getBookCommentsHandler,
    createCommentHandler,
    updateCommentHandler,
    deleteCommentHandler
};
