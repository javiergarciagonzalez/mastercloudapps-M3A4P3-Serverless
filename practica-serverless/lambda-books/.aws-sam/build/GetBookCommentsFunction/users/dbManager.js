const uuid = require('uuid');

const { docClient, USERS_TABLE } = require('./../config/db.js');

const getAllUsers = async () => {
    const userParams = {
        TableName: USERS_TABLE
    };

    const { Items: users } = await docClient.scan(userParams).promise();

    return users;
};

const getUser = async id => {
    const userParams = {
        TableName: USERS_TABLE,
        Key: {
            id
        }
    };

    const { Item: user } = await docClient.get(userParams).promise();
    return user;
};

const getUserByNick = async id => {
    const userParams = {
        TableName: USERS_TABLE,
        Key: {
            id
        }
    };
    const { Item: user } = await docClient.get(userParams).promise();
    return user;
};

const createUser = async (nick, email) => {
    const userParams = {
        TableName: USERS_TABLE,
        Item: {
            id: uuid.v1(),
            nick,
            email
        }
    };
    await docClient.put(userParams).promise();
    return userParams.Item;
};

const updateUser = async (id, email) => {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set email = :e',
        ExpressionAttributeValues: {
            ':e': email
        },
        ReturnValues: 'ALL_NEW'
    };

    const { Attributes: userAttributes } = await docClient
        .update(params)
        .promise();
    return userAttributes;
};

const deleteUser = async id => {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            id
        },
        ReturnValues: 'ALL_OLD'
    };

    const { Attributes: userAttributes } = await docClient
        .delete(params)
        .promise();
    return userAttributes;
};

module.exports = {
    getAllUsers,
    getUser,
    getUserByNick,
    createUser,
    updateUser,
    deleteUser
};
