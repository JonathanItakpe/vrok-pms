const Mongoose = require('mongoose')
const Schema = Mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const uniqueValidator = require('mongoose-unique-validator');

var projectSchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true, uniqueCaseInsensitive: true },
  description: { type: String },
  is_completed: { type: Boolean, required: true, default: false },
  tasks: []
}, { timestamps: true });

projectSchema.method('markAsComplete', function (cb) {
  this.is_completed = true
  this.save(cb)
})

projectSchema.plugin(uniqueValidator);

var Project = Mongoose.model('Project', projectSchema)

module.exports = Project