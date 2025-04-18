const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommitteeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  formationDate: {
    type: Date,
    required: true
  },
  specificationSubmissionDate: {
    type: Date,
    required: true
  },
  reviewDate: {
    type: Date,
    required: true
  },
  schedule: {
    type: String
  },
  members: [{
    employeeId: String,
    name: String,
    role: String,
    email: String,
    department: String,
    designation: String
  }],
  formationLetter: {
    filename: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft',
  }
},
  { timestamps: true } // 
);

// Export the model
module.exports = mongoose.model('Committee', CommitteeSchema);