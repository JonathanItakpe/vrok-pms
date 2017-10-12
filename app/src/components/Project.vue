<template>
  <div>
    <div class="row">
      <div class="col-sm-8">
        <h4>PROJECT - {{ project.name }}</h4>
        <small>{{ project.tasks_done }}/{{ project.number_of_tasks }} Tasks done</small>
      </div>
      <div class="col-sm-4">
        <!-- Single button -->
        <div class="btn-group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Sort By <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li v-for="option in sort_by_options" ::key="option.name"><a @click="changeTaskSort(option)">{{ option.name }}</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <!-- Default panel contents -->
          <div class="panel-heading">New</div>
          <div class="panel-body">
            <button class="btn btn-success" @click="showNewTaskModal = !showNewTaskModal">Add New Task</button>
          </div>
        </div>
      </div>
      <div class="col-sm-4" v-for="task in project.tasks" :key="task._id">
        <div class="panel" :class="[ task.is_completed ? 'panel-success' : 'panel-default' ]">
          <!-- Default panel contents -->
          <div class="panel-heading">{{ task.name }}</div>
          <div class="panel-body">
            <p>{{ task.description }}</p>
            <div class="row">
              <div class="col-xs-6">
                <h5>Due:</h5>
                <p>{{ task.due_date_formatted }}</p>
              </div>
              <div class="col-xs-6">
                <h5>Priority:</h5>
                <p>{{ task.priority }}</p>
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <router-link :to="{ name: 'Task', params: { task_id: task._id }}" tag="button" class="btn btn-success">View Sub-Tasks</router-link>
            <button class="btn btn-primary" @click="showEditTaskModal(task)">Edit Task</button>
            <button class="btn btn-danger" @click="deleteTask(task)">Delete Task</button>
          </div>
        </div>
      </div>
    </div>
    <modal :show.sync="showNewTaskModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Add New Task
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="add_task.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="add_task.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>Priority</label>
                <select class="form-control" v-model="add_task.priority">
                  <option v-for="n in 5">{{ n }}</option> 
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>Due Date</label>
                <datepicker v-model="add_task.due_date" class="form-control"></datepicker>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showNewTaskModal = false">Exit</button>
        <button type="button" class="btn btn-success" @click="addTask">Save</button>
      </div>
    </modal>

    <modal :show.sync="showEditModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Edit Task - {{ selected_task.name }}
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="selected_task.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="selected_task.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>Priority</label>
                <select class="form-control" v-model="selected_task.priority">
                  <option v-for="n in 5">{{ n }}</option> 
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>Due Date</label>
                <datepicker v-model="selected_task.due_date" class="form-control"></datepicker>
              </div>
            </div>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="selected_task.is_completed"> Is Complete
            </label>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="hideEditTaskModal">Exit</button>
        <button type="button" class="btn btn-success" @click="editTask">Update</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { getProjectById } from '../services/projects'
import { getTasksByProjectId, createTask, updateTask, deleteTask } from '../services/tasks'
import { modal } from 'vue-strap'
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    modal,
    Datepicker
  },
  data () {
    return {
      project: {},
      sort_by_options: [
        { name: 'Name Desc', value: { sort: 'name', direction: -1}},
        { name: 'Name Asc', value: { sort: 'name', direction: 1}},
        { name: 'Priority Desc', value: { sort: 'priority', direction: -1}},
        { name: 'Priority Asc', value: { sort: 'priority', direction: 1}},
        { name: 'Due Date Desc', value: { sort: 'due_date', direction: -1}},
        { name: 'Due Date Asc', value: { sort: 'due_date', direction: 1}},
        { name: 'Created Desc', value: { sort: 'createdAt', direction: -1}},
        { name: 'Created Asc', value: { sort: 'createdAt', direction: 1}},
      ],
      sort_by: null,
      showNewTaskModal: false,
      showEditModal: false,
      add_task: {
        name: '',
        description: '',
        priority: 1,
        due_date: ''
      },
      selected_task: {}
    }
  },
  created() {
    this.getProjectDetails(this.$route.params.project_id);
  },
  methods: {
    getProjectDetails(id){
      getProjectById(id)
        .then((resp) => {
          this.project = resp.data
          this.getTasks(this.$route.params.project_id)
        }).catch((err) => {
          console.log(err)
        })
    },
    getTasks(id, options){
      getTasksByProjectId(id, options)
        .then((resp) => {
          this.project.tasks = resp.data
          // Get Done count just for fun
          this.project.number_of_tasks = (resp.data.length) ? resp.data.length : 0
          this.project.tasks_done = 0
          this.project.tasks.forEach(function(task) {
            if (task.is_completed == true) this.project.tasks_done++
            // Format Date 
            task.due_date_formatted = this.$moment(task.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")
          }, this);
        }).catch((err) => {
          console.log(err)
        })
    },
    changeTaskSort(sort){
      this.getTasks(this.$route.params.project_id, {sort: sort.value.sort, direction: sort.value.direction})
      this.sort_by = sort.name
      this.$toastr.success(`Tasks sorted by ${this.sort_by}`)
    },
    addTask(){
      this.add_task.project = this.$route.params.project_id
      createTask(this.add_task)
        .then((resp) => {
          this.getTasks(this.$route.params.project_id)
          this.$toastr.success(`Task Added - ${this.add_task.name}`) 
          this.showNewTaskModal = false         
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to add task - ${this.add_task.name}`)    
          this.showNewTaskModal = false                                   
        })
    },
    showEditTaskModal(task){
      this.selected_task = task  
      this.showEditModal = true
    },
    hideEditTaskModal(){
      this.selected_task = {}      
      this.showEditModal = false
    },
    editTask(){
      let needed_data = this.$_.pick(this.selected_task, ['name', 'description', 'priority', 'is_completed', 'due_date'])

      updateTask(this.selected_task._id, needed_data)
        .then((resp) => {
          this.getTasks(this.$route.params.project_id)
          this.$toastr.success(`Task Updated - ${this.selected_task.name}`) 
          this.hideEditTaskModal()   
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to update task - ${this.selected_task.name}`)    
          this.hideEditTaskModal()                                  
        })
    },
    deleteTask(task){
      deleteTask(task._id)
        .then((resp) => {
          this.getTasks(this.$route.params.project_id)
          this.$toastr.success(`Task Delete - ${task.name}`) 
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to delete task - ${task.name}`)                                   
        })
    }
  }
}
</script>
