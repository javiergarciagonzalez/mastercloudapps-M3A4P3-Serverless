const buildResponse = (statusCode, response = {}) => ({
    statusCode,
    body: JSON.stringify(response)
});

module.exports = buildResponse;
