const router  = require('express').Router()
const SubTaskController = require('../app/controllers/SubTaskController')

router.get('/', SubTaskController.getSubTasks)
router.post('/', SubTaskController.createSubTask)
router.get('/:id', SubTaskController.getSubTask)
router.put('/:id', SubTaskController.updateSubTask)
router.delete('/:id', SubTaskController.deleteSubTask)

module.exports = router