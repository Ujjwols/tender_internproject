const express = require('express');
const router = express.Router();
const upload = require('../config/multer.js');
const authController = require('../controllers/authController.js');
const permissionMiddleware = require('../middleware/permisssionMiddleware.js');
const {
  createCommittee,
  getCommittees,
  getCommittee,
  updateCommittee,
  deleteCommittee,
  downloadFormationLetter
} = require('../controllers/committeeController.js');

// Protect all committee routes
router.use(authController.protect);

// POST /api/committees - Create new committee
router.post('/createcommittees', upload.single('formationLetter'), createCommittee);


// router.post(
//   '/createcommittees',
//   permissionMiddleware.checkPermission('manage_committees'),
//   upload.single('formationLetter'),
//   createCommittee
// );

// GET /api/committees - Get all committees
router.get('/getallcommittee', getCommittees);

// GET /api/committees/:id - Get single committee
router.get('/getcommitteebyid/:id', getCommittee);

// PATCH /api/committees/:id - Update a committee
// Requires 'manage_committees' permission
router.patch(
  '/updatecommittees/:id',
  permissionMiddleware.checkPermission('manage_committees'),
  upload.single('formationLetter'),
  updateCommittee
);

// DELETE /api/committees/:id - Delete a committee
// Requires 'manage_committees' permission
router.delete(
  '/deletecommittee/:id',
  permissionMiddleware.checkPermission('manage_committees'),
  deleteCommittee
);

// GET /api/committees/:id/download - Download formation letter
router.get('/:id/download', downloadFormationLetter);

module.exports = router;