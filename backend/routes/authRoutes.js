const express = require('express');
const authController = require('../controllers/authController.js');
const permissionMiddleware = require('../middleware/permisssionMiddleware.js');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('role', 'Role is required').not().isEmpty(),
    check('employeeId', 'Employee ID is required').not().isEmpty(),
    check('department', 'Department is required').not().isEmpty(),
    check('phoneNumber', 'Phone number is required').isMobilePhone('any'),
    check('designation', 'Designation is required').not().isEmpty(),
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

router.post(
  '/verify-otp',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
  ],
  authController.verifyOTP
);

router.get('/users', authController.getAllUsers);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/employee/:employeeId', authController.getUserByEmployeeId);

router.use(authController.protect);

router.patch(
  '/me/update',
  [
    check('email').optional().isEmail().withMessage('Please include a valid email'),
  ],
  authController.updateMe
);

router
  .route('/users/:userId')
  .patch(
    permissionMiddleware.checkPermission('manage_users'),
    [
      check('email').optional().isEmail().withMessage('Please include a valid email'),
      check('role')
        .optional()
        .isIn([
          'admin',
          'procurement_officer',
          'committee_member',
          'evaluator',
          'bidder',
          'complaint_manager',
          'project_manager',
        ])
        .withMessage('Invalid role'),
    ],
    authController.updateUser
  )
  .delete(
    permissionMiddleware.checkPermission('manage_users'),
    authController.deleteUser
  );

router.patch('/update-password', authController.updatePassword);

module.exports = router;