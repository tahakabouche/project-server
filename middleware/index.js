const logger = require('./logger');
const errorHandler = require('./errorhandler');
const asyncHandler = require('./asynchandler');
const {protect, authorize, watch} = require('./auth');
const advancedResults = require('./advancedResults');

module.exports = {
    logger,
    errorHandler,
    asyncHandler,
    protect,
    authorize,
    watch,
    advancedResults
};