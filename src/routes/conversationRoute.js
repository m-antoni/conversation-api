const express = require('express');
const Controller = require('../controllers/conversationController');
const validateDto = require('../middlewares/validateDto');
const conversationSchema = require('../schema/conversationSchema');

const router = express.Router();

//*******************************************
// * ROUTES
// * ROOT URL: '/api/v1/conversation + <YOUR DEFINE ROUTE>
// ******************************************

router.get('/', Controller.get);
router.post('/', [validateDto(conversationSchema)], Controller.create);
router.delete('/:id', Controller.archived);

module.exports = router;
