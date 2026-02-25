const express = require('express');
const router = express.Router();
const { itemController, activityController } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware'); // assuming it exists

router.use(authMiddleware);

// Item routes
router.get('/', itemController.getAll);
router.get('/:id', itemController.getById);
router.post('/', itemController.create);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

// Activity routes
router.get('/activities/all', activityController.getAll);

module.exports = router;
