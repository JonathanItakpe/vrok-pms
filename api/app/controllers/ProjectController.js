const Project = require('../models/project')
const Task = require('../models/task')
const _ = require('lodash')
const ResponseService = require('../../helpers/responseService')

class ProjectController {
  getProjects (req, res) {
    Project.find({})
      .exec((err, projects) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)

        return ResponseService.json(200, "success", res, "All projects", projects)
      })
  }

  getProjectTasks(req, res) {
    var query = Task.find({ project: req.params.id })

    if(req.query.sort && req.query.direction){
      let sort = {}
      sort[req.query.sort] = req.query.direction
      query.sort(sort)
    }

    query.exec((err, tasks) => {
      if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)        

      return ResponseService.json(200, "success", res, "Project's Tasks", tasks)
    })
  }

  getProject(req, res) {
    Project.findById(req.params.id)
      .exec((err, project) => {
        if(err) return ResponseService.json(500, "error", res, 'An error occurred.', null, err)
        if(!project) return ResponseService.json(404, "error", res, "Project not found")

        return ResponseService.json(200, "success", res, "Project", project)
      }) 
  }

  createProject(req, res) {
    req.checkBody('name', "Name field is required").notEmpty();
    
    req.getValidationResult()
      .then((result) => {
        if(!result.isEmpty()){
          return ResponseService.json(400, 'error', res, 'Data Failed to pass validation', result.array())
        }

        let project_data = _.pick(req.body, ['name', 'description']);
        let project = new Project(project_data);

        project.save((err) => {
          if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
          
          return ResponseService.json(200, 'success', res, 'Project Created', project)
        })
      })
  }

  updateProject(req, res) {
    let req_data = _.pick(req.body, ['name', 'description', 'is_completed'])

    Project.findByIdAndUpdate(req.params.id, req_data, { new: true }, (err, project) => {
      if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)

      return ResponseService.json(200, 'success', res, 'Project Updated', project)        
    })
  }

  deleteProject(req, res) {
    Project.findByIdAndRemove(req.params.id, (err) => {
      if (err) return ResponseService.json(500, 'error', res, 'An error occurred.', null, err)
      return ResponseService.json(200, 'success', res, 'Project Deleted')
    });
  }
}

module.exports = new ProjectController
