<template>
  <div class="hello">
    <div class="row">
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <!-- Default panel contents -->
          <div class="panel-heading">Project</div>
          <div class="panel-body">
            <router-link :to="{ name: 'Tasks' }" tag="button" class="btn btn-info">All Tasks</router-link>            
            <button class="btn btn-success" @click="showNewProjectModal = !showNewProjectModal">Create New Project</button>
          </div>
        </div>
      </div>
      <div class="col-sm-4" v-for="project in projects">
        <div class="panel" :class="[ project.is_completed ? 'panel-success' : 'panel-default' ]" >
          <div class="panel-heading">
            <h3 class="panel-title">{{ project.name }}</h3>
          </div>
          <div class="panel-body">
            {{ project.description }}
          </div>
          <div class="panel-footer">
            <router-link :to="{ name: 'Project', params: { project_id: project._id }}" tag="button" class="btn btn-success">View Tasks</router-link>
            <button class="btn btn-primary" @click="showEditProjectModal(project)">Edit Project</button>
            <button class="btn btn-danger" @click="deleteProject(project)">Delete Project</button>
          </div>
        </div>
      </div>
    </div>

    <modal :show.sync="showNewProjectModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Create Project
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="add_project.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="add_project.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showNewProjectModal = false">Exit</button>
        <button type="button" class="btn btn-success" @click="addProject">Create</button>
      </div>
    </modal>

    <modal :show.sync="showEditModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          Edit Task - {{ selected_project.name }}
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label>Name</label>
            <input v-model="selected_project.name" class="form-control" placeholder="E.g Fry the plantain">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="selected_project.description" class="form-control" rows="3" placeholder="Bruh, just fry the damn plantain!"></textarea>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="selected_project.is_completed"> Is Complete
            </label>
          </div>
        </form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="hideEditProjectModal">Exit</button>
        <button type="button" class="btn btn-success" @click="editProject">Update</button>
      </div>
    </modal>
  </div>
</template>

<script>
import {allProjects, updateProject, createProject, deleteProject } from '../services/projects'
import { modal } from 'vue-strap'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'Dashboard',
  components: {
    modal,
    Datepicker
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      projects: [],
      showNewProjectModal: false,
      showEditModal: false,
      add_project: {
        name: '',
        description: ''
      },
      selected_project: {}
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      allProjects()
        .then((resp) => {
          this.projects = resp.data
        }).catch((err) => {
          console.log(err);
          this.$toastr.error("Could NOT load Projects")
        })
    },
    addProject() {
      createProject(this.add_project)
        .then((resp) => {
          this.getProjects()
          if(resp.status = 'error'){
            this.$toastr.error(`Project NOT Created - ${this.add_project.name}`)           
          }else{
            this.$toastr.success(`Project Created - ${this.add_project.name}`)             
          }
          this.showNewProjectModal = false         
        }).catch((err) => {
          console.log(err)
          this.showNewProjectModal = false                                   
        })
    },
    hideEditProjectModal() {
      this.selected_project= {}
      this.showEditModal= false
    },
    showEditProjectModal(project) {
      this.selected_project= project
      this.showEditModal= true
    },
    editProject() {
      let needed_data = this.$_.pick(this.selected_project, ['name', 'description', 'is_completed'])

      updateProject(this.selected_project._id, needed_data)
        .then((resp) => {
          this.getProjects()
          this.$toastr.success(`Project Updated - ${this.selected_project.name}`) 
          this.hideEditProjectModal()   
        }).catch((err) => {
          console.log(err)
          this.$toastr.error(`Unable to update Project - ${this.selected_project.name}`)    
          this.hideEditProjectModal()                                  
        })
    },
    deleteProject(project) {
      deleteProject(project._id)
        .then((resp) => {
          this.getProjects()
          this.$toastr.success(`Project Deleted - ${project.name}`) 
        }).catch((err) => {
          this.$toastr.error(`Unable to delete Project - ${project.name}`)    
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel.panel--styled {
    background: #F4F2F3;
}
.panelTop {
    padding: 30px;
}

.panelBottom {
    border-top: 1px solid #e7e7e7;
    padding-top: 20px;
}
.btn-add-to-cart {
    background: #FD5A5B;
    color: #fff;
}
.btn.btn-add-to-cart.focus, .btn.btn-add-to-cart:focus, .btn.btn-add-to-cart:hover  {
	color: #fff;   
    background: #FD7172;
	outline: none;
}
.btn-add-to-cart:active {
	background: #F9494B;
	outline: none;
}


span.itemPrice {
    font-size: 24px;
    color: #FA5B58;
}
</style>
