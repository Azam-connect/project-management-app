const mongoose = require('mongoose');
const { PmaDB } = require('../../../config/dbConnection');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true }
);

const Project = PmaDB.model('project', ProjectSchema, 'Projects');
module.exports = { Project };
