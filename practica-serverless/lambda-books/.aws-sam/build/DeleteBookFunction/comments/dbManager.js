const uuid = require('uuid');
const { docClient, COMMENTS_TABLE } = require('../config/db.js');
const usersDbManager = require('../users/dbManager.js');
const booksDbManager = require('../books/dbManager.js');

const getUserComments = async userId => {
    const params = {
        TableName: COMMENTS_TABLE,
        FilterExpression: '#u = :u',
        ExpressionAttributeNames: {
            '#u': 'userId'
        },
        ExpressionAttributeValues: {
            ':u': userId
        }
    };

    const comments = await docClient.scan(params).promise();
    return comments.Items;
};

const getBookComments = async bookId => {
    const commentParams = {
        TableName: COMMENTS_TABLE,
        FilterExpression: '#b = :b',
        ExpressionAttributeNames: {
            '#b': 'bookId'
        },
        ExpressionAttributeValues: {
            ':b': bookId
        }
    };

    const { Items: comments } = await docClient.scan(commentParams).promise();
    const usersId = new Set(comments.map(comment => comment.userId));

    const usersById = usersId.map(async userId => {
        const result = await usersDbManager.getUser(userId);
        return { [userId]: result };
    });

    return comments.map(({ id, comment, score, userId }) => ({
        id,
        comment,
        score,
        user: usersById[userId]
    }));
};

const createComment = async (userId, bookId, comment, score) => {
    const commentParams = {
        TableName: COMMENTS_TABLE,
        Item: {
            id: uuid.v1(),
            userId,
            bookId,
            comment,
            score
        }
    };
    await docClient.put(commentParams).promise();
    return commentParams.Item;
};

const updateComment = async (commentId, text, nickname, score) => {
    const commentParams = {
        TableName: COMMENTS_TABLE,
        Key: {
            commentid: commentid
        },
        UpdateExpression: 'set #te = :t, nickname = :n, score = :s',
        ExpressionAttributeNames: {
            '#te': 'text'
        },
        ExpressionAttributeValues: {
            ':t': text,
            ':n': nickname,
            ':s': score
        },
        ReturnValues: 'ALL_OLD' // Returns the item content before it was updated
    };

    await docClient.update(commentParams).promise();
    return commentParams.Item;
};

const deleteComment = async (bookId, commentId) => {
    const bookResponse = await booksDbManager.getBook(bookId);

    if (bookResponse) {
        throw new Error('Book not found');
    }

    const commentParams = {
        TableName: table,
        Key: {
            commentId
        },
        ConditionExpression: 'commentId = :commentId',
        ExpressionAttributeValues: {
            ':commentId': commentId
        },
        ReturnValues: 'ALL_OLD' // Returns the item content before it was deleted
    };

    await docClient.delete(commentParams).promise();
    return commentParams.Item;
};

module.exports = {
    getBookComments,
    getUserComments,
    createComment,
    updateComment,
    deleteComment
};
