const express = require('express');
const userController = require('../controllers/usersController');
const employeesController = require('../controllers/employeesController');
const authController = require('../controllers/authController');
const refreshTokenController = require('../controllers/refreshTokenController');

const router = express.Router();

router.route('/api/employee')
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route('/api/employee/:id')
  .get(employeesController.getEmployee);

router.route('/api/users')
  .post(userController.createNewUser);

router.route('/api/user/auth')
  .post(authController.loginUser)
  .get(authController.logOutUser);

router.route('/api/refresh')
  .get(refreshTokenController.handleRefreshToken);

module.exports = router;
