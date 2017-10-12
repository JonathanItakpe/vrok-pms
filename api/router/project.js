const router  = require('express').Router()
const ProjectController = require('../app/controllers/ProjectController')

// Get all Projects -- /project
router.get('/', ProjectController.getProjects)
router.post('/', ProjectController.createProject)
router.get('/:id', ProjectController.getProject)
router.get('/:id/tasks', ProjectController.getProjectTasks)
router.put('/:id', ProjectController.updateProject)
router.delete('/:id', ProjectController.deleteProject)

module.exports = router