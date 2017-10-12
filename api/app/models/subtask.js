const Mongoose = require('mongoose')
const Schema = Mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

var subTaskSchema = new Schema({
  name: { type: String, required: true, trim: true, index: { unique: true } },
  description: { type: String },
  priority: {type: Number, min: 1, max: 5},
  is_completed: { type: Boolean, required: true, default: false },
  due_date: { type: Date },
  task: { type: Schema.Types.ObjectId, ref: 'Task' }
}, { timestamps: true });

module.exports = Mongoose.model('SubTask', subTaskSchema)