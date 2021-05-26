const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

const BOOKS_TABLE = 'books';
const COMMENTS_TABLE = 'comments';
const USERS_TABLE = 'users';

module.exports = {
    docClient,
    BOOKS_TABLE,
    COMMENTS_TABLE,
    USERS_TABLE
};
