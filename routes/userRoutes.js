const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const userController = require('../controllers/authController');

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);


// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
