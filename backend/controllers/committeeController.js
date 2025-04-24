const Committee = require('../models/committeFormModel.js');
const User = require('../models/userModel.js');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError.js');
const nodemailer = require('nodemailer');
const validator = require('validator');
const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/email.log' }),
    new winston.transports.Console()
  ]
});

// @desc    Create a new committee
// @route   POST /api/committees
const createCommittee = async (req, res, next) => {
  try {
    const { 
      name, 
      purpose, 
      formationDate, 
      specificationSubmissionDate,
      reviewDate,
      schedule,
      members,
      shouldNotify
    } = req.body;

    // Process members
    let membersArray = [];
    if (members && members.length > 0) {
      let memberData = typeof members === 'string' ? JSON.parse(members) : members;
      
      const memberIds = memberData.map(m => 
        typeof m === 'string' ? m : (m.employeeId || '')
      );

      if (!memberIds.every(id => typeof id === 'string' && id.trim() !== '')) {
        return next(new AppError('All member IDs must be non-empty strings', 400));
      }

      for (const employeeId of memberIds) {
        const user = await User.findOne({ employeeId });
        if (!user) {
          return next(new AppError(`User with employee ID ${employeeId} not found`, 404));
        }
        
        membersArray.push({
          name: user.name,
          role: user.role,
          email: user.email,
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation
        });
      }
    }

    const committee = new Committee({
      name,
      purpose,
      formationDate,
      specificationSubmissionDate,
      reviewDate,
      schedule,
      members: membersArray,
      createdBy: req.user._id,
      formationLetter: req.file ? {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    await committee.save();
    
    const populatedCommittee = await Committee.findById(committee._id)
      .populate('createdBy', 'name email role employeeId');

    if (shouldNotify === 'true') {
      await sendCommitteeNotifications(populatedCommittee);
    }

    res.status(201).json({
      status: 'success',
      data: { committee: populatedCommittee }
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, err => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    next(error);
  }
};

// @desc    Get all committees with creator details
// @route   GET /api/committees
const getCommittees = async (req, res, next) => {
  try {
    const committees = await Committee.find()
      .sort('-createdAt')
      .populate('createdBy', 'name email role employeeId');

    res.status(200).json({
      status: 'success',
      results: committees.length,
      data: { committees }
    });
  } catch (error) {
    next(new AppError('Failed to fetch committees', 500));
  }
};

// @desc    Get single committee with creator details
// @route   GET /api/committees/:id
const getCommittee = async (req, res, next) => {
  try {
    const committee = await Committee.findById(req.params.id)
      .populate('createdBy', 'name email role employeeId');

    if (!committee) {
      return next(new AppError('Committee not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { committee }
    });
  } catch (error) {
    next(new AppError('Failed to fetch committee', 500));
  }
};

// @desc    Download formation letter
// @route   GET /api/committees/:id/download
const downloadFormationLetter = async (req, res, next) => {
  try {
    const committee = await Committee.findById(req.params.id);
    
    if (!committee) {
      return next(new AppError('Committee not found', 404));
    }
    
    if (!committee.formationLetter) {
      return next(new AppError('No formation letter found', 404));
    }

    const filePath = path.join(__dirname, '../', committee.formationLetter.path);
    if (!fs.existsSync(filePath)) {
      return next(new AppError('File not found on server', 404));
    }

    res.download(filePath, committee.formationLetter.originalname);
  } catch (error) {
    next(new AppError('Error downloading file', 500));
  }
};

// Helper function for sending notifications
const sendCommitteeNotifications = async (committee) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailPromises = committee.members.map(async (member) => {
      if (!validator.isEmail(member.email)) {
        logger.warn(`Invalid email for member ${member.employeeId}: ${member.email}`);
        return { email: member.email, status: 'failed', error: 'Invalid email' };
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: member.email,
          subject: `You've been added to committee: ${committee.name}`,
          html: `
            <h1>Committee Assignment</h1>
            <p>You have been added to the committee <strong>${committee.name}</strong>.</p>
            <p>Purpose: ${committee.purpose}</p>
            <p>Formation Date: ${new Date(committee.formationDate).toLocaleDateString()}</p>
            ${committee.formationLetter ? `<p>A formation letter is attached to this email.</p>` : ''}
            <p>Created by: ${committee.createdBy.name}</p>
          `,
          attachments: committee.formationLetter ? [{
            filename: committee.formationLetter.originalname,
            path: committee.formationLetter.path
          }] : []
        });
        return { email: member.email, status: 'success' };
      } catch (error) {
        return { email: member.email, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(mailPromises);
    const failures = results.filter(r => r.status === 'failed');
    
    if (failures.length > 0) {
      logger.error('Failed to send emails:', failures);
    } else {
      logger.info(`Notifications sent for committee ${committee._id}`);
    }
  } catch (error) {
    logger.error('Error sending notifications:', error);
  }
};

// @desc    Update a committee
// @route   PATCH /api/committees/:id
const updateCommittee = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Update committee ID:', id);

    const committee = await Committee.findById(id).populate(
      'createdBy',
      'name email role employeeId'
    );

    if (!committee) {
      return next(new AppError('No committee found with that ID', 404));
    }

    const allowedUpdates = {
      name: req.body.name,
      purpose: req.body.purpose,
      formationDate: req.body.formationDate,
      specificationSubmissionDate: req.body.specificationSubmissionDate,
      reviewDate: req.body.reviewDate,
      schedule: req.body.schedule,
      members: req.body.members,
      shouldNotify: req.body.shouldNotify,
      approvalStatus: req.body.approvalStatus,
    };

    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    let membersArray = [];
    if (allowedUpdates.members && allowedUpdates.members.length > 0) {
      let memberData =
        typeof allowedUpdates.members === 'string'
          ? JSON.parse(allowedUpdates.members)
          : allowedUpdates.members;

      const memberIds = memberData.map((m) =>
        typeof m === 'string' ? m : m.employeeId || ''
      );

      if (!memberIds.every((id) => typeof id === 'string' && id.trim() !== '')) {
        return next(new AppError('All member IDs must be non-empty strings', 400));
      }

      for (const employeeId of memberIds) {
        const user = await User.findOne({ employeeId });
        if (!user) {
          return next(
            new AppError(`User with employee ID ${employeeId} not found`, 404)
          );
        }

        membersArray.push({
          name: user.name,
          role: user.role,
          email: user.email,
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation,
        });
      }
      allowedUpdates.members = membersArray;
    }

    if (req.body.formationLetter) {
      logger.warn('formationLetter ignored; file upload not enabled');
    }

    Object.assign(committee, allowedUpdates);
    await committee.save();

    const populatedCommittee = await Committee.findById(committee._id).populate(
      'createdBy',
      'name email role employeeId'
    );

    if (req.body.shouldNotify === 'true') {
      await sendCommitteeNotifications(populatedCommittee);
    }

    logger.info('Committee updated:', {
      timestamp: new Date().toISOString(),
      committeeId: committee._id,
      name: committee.name,
      updatedBy: req.user._id,
    });

    res.status(200).json({
      status: 'success',
      data: {
        committee: populatedCommittee,
      },
    });
  } catch (error) {
    next(new AppError('Failed to update committee', 500));
  }
};

// @desc    Delete a committee
// @route   DELETE /api/committees/:id
const deleteCommittee = async (req, res, next) => {
  const { id } = req.params;

  try {
    const committee = await Committee.findById(id);
    if (!committee) {
      return next(new AppError('No committee found with that ID', 404));
    }

    if (committee.formationLetter && committee.formationLetter.path) {
      fs.unlink(committee.formationLetter.path, (err) => {
        if (err) logger.error('Error deleting file:', err);
      });
    }

    await Committee.findByIdAndDelete(id);

    logger.info('Committee deleted:', {
      timestamp: new Date().toISOString(),
      committeeId: committee._id,
      name: committee.name,
      deletedBy: req.user._id,
    });

    res.status(204).json({
      status: 'success',
      message: 'Committee deleted successfully',
    });
  } catch (err) {
    logger.error('Error deleting committee:', err);
    return next(new AppError('Error deleting committee', 400));
  }
};

module.exports = {
  createCommittee,
  getCommittees,
  getCommittee,
  updateCommittee,
  deleteCommittee,
  downloadFormationLetter
};