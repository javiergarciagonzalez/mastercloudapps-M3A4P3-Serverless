const booksDbManager = require('./dbManager.js');
const buildResponse = require('../config/buildResponse.js');
const statusCodes = require('../config/statusCodes.js');
const commentsDbManager = require('../comments/dbManager.js');

const getAllBooksHandler = async () => {
    const response = await booksDbManager.getAllBooks();
    return buildResponse(statusCodes.OK, response);
};

const getBookHandler = async req => {
    const { bookId } = req.pathParameters;

    try {
        const bookResponse = await booksDbManager.getBook(bookId);
        const commentsResponse = await commentsDbManager.getBookComments(
            bookId
        );

        if (!bookResponse) {
            return buildResponse(statusCodes.NOT_FOUND);
        }

        return buildResponse(statusCodes.OK, {
            ...bookResponse,
            commentsResponse
        });
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const createBookHandler = async req => {
    const { title, summary, author, publisher, publicationYear } = JSON.parse(
        req.body
    );

    try {
        const response = await booksDbManager.createBook(
            title,
            summary,
            author,
            publisher,
            publicationYear
        );

        return buildResponse(statusCodes.CREATED, response);
    } catch (err) {
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const updateBookHandler = async req => {
    const { bookId } = req.pathParameters;
    const { title, summary, author, publisher, publicationYear } = JSON.parse(
        req.body
    );

    try {
        const response = await booksDbManager.updateBook(
            bookId,
            title,
            summary,
            author,
            publisher,
            publicationYear
        );

        if (!response) {
            return buildResponse(statusCodes.NOT_FOUND);
        }

        return buildResponse(statusCodes.OK, response);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

const deleteBookHandler = async req => {
    const { bookId } = req.pathParameters;

    try {
        const response = await booksDbManager.deleteBook(bookId);

        if (!response) {
            return buildResponse(statusCodes.NOT_FOUND);
        }

        return buildResponse(statusCodes.OK, response);
    } catch (error) {
        console.error(error);
        return buildResponse(statusCodes.SERVER_ERROR);
    }
};

module.exports = {
    getAllBooksHandler,
    getBookHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};
