const Task = require('../models/task')
const SubTask = require('../models/subtask')
const Project = require('../models/project')
const _ = require('lodash')
const ResponseService = require('../../helpers/responseService')
const moment = require('moment')

class TaskController {
  getTasks (req, res) {
    Task.find({})
      .populate('project', 'name')
      .exec((err, tasks) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)

        return ResponseService.json(200, "success", res, "All tasks", tasks)
      })
  }

  getTask(req, res) {
    Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('subtasks')
      .exec((err, task) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)
        if(!task) return ResponseService.json(404, "error", res, "Task not found")
        
        return ResponseService.json(200, "success", res, "Task", task)
      }) 
  }

  getSubTasks(req, res) {
    var query = SubTask.find({ task: req.params.id })

    if(req.query.sort && req.query.direction){
      let sort = {}
      sort[req.query.sort] = req.query.direction
      query.sort(sort)
    }

    query.exec((err, subtasks) => {
      if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)        

      return ResponseService.json(200, "success", res, "Task's Sub Tasks", subtasks)
    })
  }

  createTask(req, res) {
    req.checkBody('name', "Name field is required").notEmpty();
    req.checkBody('due_date', "Due Date field is required").notEmpty();
    req.checkBody('project', "Project field is required").notEmpty();
    
    req.getValidationResult()
      .then((result) => {
        if(!result.isEmpty()){
          return ResponseService.json(400, 'error', res, 'Data Failed to pass validation', result.array())
        }

        //TODO: Fix the date Issues -- Timezone ISH
        var task_data = _.pick(req.body, ['name', 'description', 'due_date', 'priority']);
        task_data.due_date = new Date(task_data.due_date)

        // Get the project
        Project.findById(req.body.project)
          .exec((err, project) => {
            if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)
            if(!project) return ResponseService.json(404, "error", res, "Project you are trying to create a task for does exist")

            task_data.project = project._id
            let task = new Task(task_data)
            
            task.save((err) => {
              if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
              
              return ResponseService.json(200, 'success', res, 'Task Created', task)
            })
          })
      })
  }

  updateTask(req, res) {
    Task.findById(req.params.id)
      .exec((err, task) => {
        if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
        if(!task) return ResponseService.json(404, 'error', res, 'Task not found.')

        let task_data = _.pick(req.body, ['name', 'description', 'is_completed', 'due_date', 'priority'])
        if(task_data.due_date) task_data.due_date = new Date(task_data.due_date)
        task = Object.assign(task, task_data)

        task.save((err)=> {
          if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)

          if(req.body.is_completed != true){
            return ResponseService.json(200, 'success', res, 'Task Updated', task)
          }
          // If the task was being set to completed
          // Check if all the tasks in the project have been completed
          Task.find({ project: task.project })
            .exec((err, tasks) => {
              let tasks_done_count = 0
              tasks.forEach((task) => {
                if(task.is_completed == true) tasks_done_count++
              })

              // if completed count doesn't equal tasks count
              if(tasks_done_count != tasks.length){
                return ResponseService.json(200, 'success', res, 'Task Updated', task)                      
              }

              // If it does
              // Mark Project as done
              Project.findByIdAndUpdate(task.project, { is_completed: true }, (err, project) => {
                if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
                return ResponseService.json(200, 'success', res, 'Task Updated', task)        
              })
            })
        })
      })
  }

  deleteTask(req, res) {
    Task.findByIdAndRemove(req.params.id, (err) => {
      if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
      return ResponseService.json(200, 'success', res, 'Task Deleted')
    });
  }
}

module.exports = new TaskController
