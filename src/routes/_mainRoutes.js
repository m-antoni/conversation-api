//*******************************************
// * MAIN ROUTES
// * Description: Consolidate here all the api routes
// ******************************************

const mainRoutes = async (app) => {
    app.use('/api/v1/conversation', require('./conversationRoute'));
};

module.exports = mainRoutes;
