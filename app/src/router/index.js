import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Project from '@/components/Project'
import Task from '@/components/Task'
import Tasks from '@/components/Tasks'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/project/:project_id',
      name: 'Project',
      component: Project
    },
    {
      path: '/task/:task_id',
      name: 'Task',
      component: Task
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    }
  ]
})
