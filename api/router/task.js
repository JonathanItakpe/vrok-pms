const router  = require('express').Router()
const TaskController = require('../app/controllers/TaskController')

router.get('/', TaskController.getTasks)
router.post('/', TaskController.createTask)
router.get('/:id', TaskController.getTask)
router.get('/:id/subtasks', TaskController.getSubTasks)
router.put('/:id', TaskController.updateTask)
router.delete('/:id', TaskController.deleteTask)

module.exports = router