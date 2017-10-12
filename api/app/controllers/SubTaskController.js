const Task = require('../models/task')
const SubTask = require('../models/subtask')
const Project = require('../models/project')
const _ = require('lodash')
const ResponseService = require('../../helpers/responseService')
const moment = require('moment')

class SubTaskController {
  getSubTasks (req, res) {
    SubTask.find({})
      .populate('task', 'name')
      .exec((err, subtasks) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)

        return ResponseService.json(200, "success", res, "All Sub Tasks", subtasks)
      })
  }

  getSubTask(req, res) {
    SubTask.findById(req.params.id)
      .populate('task', 'name')
      .exec((err, subtask) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)
        if(!subtask) return ResponseService.json(404, "error", res, "Subtask not found")
        
        return ResponseService.json(200, "success", res, "Subtask", subtask)
      }) 
  }

  createSubTask(req, res) {
    req.checkBody('name', "Name field is required").notEmpty();
    req.checkBody('due_date', "Due Date field is required").notEmpty();
    req.checkBody('task', "Task field is required").notEmpty();
    
    req.getValidationResult()
      .then((result) => {
        if(!result.isEmpty()){
          return ResponseService.json(400, 'error', res, 'Data Failed to pass validation', result.array())
        }

        var subtask_data = _.pick(req.body, ['name', 'description', 'due_date', 'priority']);
        subtask_data.due_date = new Date(subtask_data.due_date)

        // Get the task
        Task.findById(req.body.task)
          .exec((err, task) => {
            if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)
            if(!task) return ResponseService.json(404, "error", res, "Task you are trying to create a sub task for does exist")

            subtask_data.task = task._id
            let subtask = new SubTask(subtask_data)
            
            subtask.save((err) => {
              if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
              
              return ResponseService.json(200, 'success', res, 'SubTask Created', subtask)              
            })
          })
      })
  }

  updateSubTask(req, res) {
    let subtask_data = _.pick(req.body, ['name', 'description', 'is_completed', 'due_date', 'priority'])
    if(subtask_data.due_date) subtask_data.due_date = new Date(subtask_data.due_date)
    
    SubTask.findByIdAndUpdate(req.params.id, subtask_data, { new: true }, (err, subtask) => {
      if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)

      return ResponseService.json(200, 'success', res, 'Subtask Updated', subtask)        
    })
  }

  deleteSubTask(req, res) {
    SubTask.findByIdAndRemove(req.params.id, (err) => {
      if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
      return ResponseService.json(200, 'success', res, 'SubTask Deleted')
    });
  }
}

module.exports = new SubTaskController
