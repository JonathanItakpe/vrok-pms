const Mongoose = require('mongoose')
const Schema = Mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

var taskSchema = new Schema({
  name: { type: String, required: true, trim: true, index: { unique: true } },
  description: { type: String },
  priority: {type: Number, min: 1, max: 5, default: 1},
  is_completed: { type: Boolean, required: true, default: false },
  due_date: { type: Date },
  subtasks: [],
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = Mongoose.model('Task', taskSchema)