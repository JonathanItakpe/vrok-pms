<template>
  <div>
    <div class="row">
      <div class="col-sm-8">
        <h4>TASK - {{ task.name }}</h4>
        <small>{{ task.subtasks_done }}/{{ task.subtasks.length}} SubTasks done</small>
      </div>
      <div class="col-sm-4">
        <!-- Single button -->
        <div class="btn-group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Sort By <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li v-for="option in sort_by_options"><a @click="changeSubTaskSort(option)">{{ option.name }}</a></li>
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
            <button class="btn btn-success" @click="showNewSubTaskModal = !showNewSubTaskModal">Add New SubTask</button>
          </div>
        </div>
      </div>
      <div class="col-sm-4" v-for="subtask in task.subtasks" :key="subtask._id">
        <div class="panel" :class="[ subtask.is_completed ? 'panel-success' : 'panel-default' ]">
          <!-- Default panel contents -->
          <div class="panel-heading">{{ subtask.name }}</div>
          <div class="panel-body">
            <p>{{ subtask.description }}</p>
            <div class="row">
              <div class="col-xs-6">
                <h5>Due:</h5>
                <p>{{ subtask.due_date_formatted }}</p>
              </div>
              <div class="col-xs-6">
                <h5>Priority:</h5>
                <p>{{ subtask.priority }}</p>
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <button class="btn btn-primary" @click="showEditSubTaskModal(subtask)">Edit Sub-Task</button>
            <button class="btn btn-danger" @click="deleteSubTask(subtask)">Delete Sub-Task</button>
          </div>
        </div>
      </div>
    </div>
    <modal :show.sync="showNewSubTaskModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Add New Sub-Task
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="add_sub_task.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="add_sub_task.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>Priority</label>
                <select class="form-control" v-model="add_sub_task.priority">
                  <option v-for="n in 5">{{ n }}</option> 
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>Due Date</label>
                <datepicker v-model="add_sub_task.due_date" class="form-control"></datepicker>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showNewSubTaskModal = false">Exit</button>
        <button type="button" class="btn btn-success" @click="addSubTask">Save</button>
      </div>
    </modal>

    <modal :show.sync="showEditModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Edit SubTask - {{ selected_subtask.name }}
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="selected_subtask.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="selected_subtask.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>Priority</label>
                <select class="form-control" v-model="selected_subtask.priority">
                  <option v-for="n in 5">{{ n }}</option> 
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>Due Date</label>
                <datepicker v-model="selected_subtask.due_date" class="form-control"></datepicker>
              </div>
            </div>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="selected_subtask.is_completed"> Is Complete
            </label>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="hideEditSubTaskModal">Exit</button>
        <button type="button" class="btn btn-success" @click="editSubTask">Update</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { getTaskById } from '../services/tasks'
import { getSubTasksByTaskId, createSubTask, updateSubTask, deleteSubTask } from '../services/subtasks'
import { modal } from 'vue-strap'
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    modal,
    Datepicker
  },
  data () {
    return {
      task: {},
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
      showNewSubTaskModal: false,
      showEditModal: false,
      add_sub_task: {
        name: '',
        description: '',
        priority: 1,
        due_date: ''
      },
      selected_subtask: {}
    }
  },
  mounted() {
    this.getTaskDetails(this.$route.params.task_id);
  },
  methods: {
    getTaskDetails(id){
      getTaskById(id)
        .then((resp) => {
          this.task = resp.data
          this.getSubTasks(id)
        }).catch((err) => {
          console.log(err)
        })
    },
    getSubTasks(id, options){
      getSubTasksByTaskId(id, options)
        .then((resp) => {
          this.task.subtasks = resp.data
          // Get Done count just for fun
          this.task.subtasks_done = 0
          this.task.subtasks.forEach(function(subtask) {
            if (subtask.is_completed == true) this.task.subtasks_done++
            // Format Date 
            subtask.due_date_formatted = this.$moment(subtask.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")
          }, this);
        }).catch((err) => {
          console.log(err)
        })
    },
    changeSubTaskSort(sort){
      this.getSubTasks(this.$route.params.task_id, {sort: sort.value.sort, direction: sort.value.direction})
      this.sort_by = sort.name
      this.$toastr.success(`SubTasks sorted by ${this.sort_by}`)
    },
    addSubTask(){
      this.add_sub_task.task = this.$route.params.task_id
      createSubTask(this.add_sub_task)
        .then((resp) => {
          this.getSubTasks(this.$route.params.task_id)
          if(resp.status == 'success'){
            this.$toastr.success(`SubTask Added - ${this.add_sub_task.name}`)             
          }else{
            this.$toastr.error(`Unable to add SubTask - ${this.add_sub_task.name}`)                
          }
          this.showNewSubTaskModal = false         
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to add SubTask - ${this.add_sub_task.name}`)    
          this.showNewSubTaskModal = false                                   
        })
    },
    showEditSubTaskModal(subtask){
      this.selected_subtask = subtask  
      this.showEditModal = true
    },
    hideEditSubTaskModal(){
      this.selected_subtask = {}      
      this.showEditModal = false
    },
    editSubTask(){
      let needed_data = this.$_.pick(this.selected_subtask, ['name', 'description', 'priority', 'is_completed', 'due_date'])

      updateSubTask(this.selected_subtask._id, needed_data)
        .then((resp) => {
          this.getSubTasks(this.$route.params.task_id)
          this.$toastr.success(`Task Updated - ${this.selected_subtask.name}`) 
          this.hideEditSubTaskModal()   
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to update task - ${this.selected_subtask.name}`)    
          this.hideEditSubTaskModal()                                  
        })
    },
    deleteSubTask(subtask){
      deleteSubTask(subtask._id)
        .then((resp) => {
          this.getSubTasks(this.$route.params.task_id)
          this.$toastr.success(`Sub Task Deleted - ${subtask.name}`) 
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to delete subtask - ${subtask.name}`)                                   
        })
    }
  }
}
</script>
