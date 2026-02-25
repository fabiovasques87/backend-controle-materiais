const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, (req, res) => userController.getAll(req, res));
router.get('/:id', authMiddleware, (req, res) => userController.getOne(req, res));
router.post('/', authMiddleware, (req, res) => userController.create(req, res));
router.put('/:id', authMiddleware, (req, res) => userController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => userController.delete(req, res));

module.exports = router;
