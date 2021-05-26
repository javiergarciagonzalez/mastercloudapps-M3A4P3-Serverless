const uuid = require('uuid');

const { docClient, BOOKS_TABLE } = require('../config/db.js');

const getAllBooks = async () => {
    const booksParams = {
        TableName: BOOKS_TABLE
    };

    const { Items } = await docClient.scan(booksParams).promise();
    const books = Items.map(({ bookId, title }) => {
        return {
            bookId,
            title
        };
    });
    return books;
};

const getBook = async bookId => {
    var bookParams = {
        TableName: BOOKS_TABLE,
        KeyConditionExpression: 'bookId = :b',
        ExpressionAttributeValues: {
            ':b': bookId
        }
    };
    const books = await docClient.query(bookParams).promise();
    const [book] = books.Items;
    return book;
};

const createBook = async (
    title,
    summary,
    author,
    publisher,
    publicationYear
) => {
    const bookParams = {
        TableName: BOOKS_TABLE,
        Item: {
            bookid: uuid.v1(),
            title,
            author,
            publisher,
            publicationYear,
            summary,
            comments: []
        }
    };

    await docClient.put(bookParams).promise();

    return bookParams.Item;
};

const updateBook = async (
    bookId,
    title,
    summary,
    author,
    publisher,
    publicationYear
) => {
    const bookParams = {
        TableName: BOOKS_TABLE,
        Key: {
            bookid: bookId
        },
        UpdateExpression:
            'set title = :t, summary = :s, author = :a, publisher = :p, publicationYear = :y',
        ExpressionAttributeValues: {
            ':t': title,
            ':s': summary,
            ':a': author,
            ':p': publisher,
            ':y': publicationYear
        },
        ReturnValues: 'ALL_NEW'
    };

    const { Attributes: bookAttributes } = await docClient
        .update(bookParams)
        .promise();

    return bookAttributes;
};

const deleteBook = async bookId => {
    const bookParams = {
        TableName: BOOKS_TABLE,
        Key: {
            bookId
        },
        ConditionExpression: 'bookId = :bookId',
        ExpressionAttributeValues: {
            ':bookId': bookId
        },
        ReturnValues: 'ALL_OLD'
    };

    const { Attributes: bookAttributes } = await docClient
        .delete(bookParams)
        .promise();

    return bookAttributes;
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};
