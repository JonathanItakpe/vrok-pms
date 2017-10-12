<template>
  <div>
    <div class="row" style="margin-bottom: 20px;">
      <div class="col-xs-2">
        <label>Name</label>
        <input v-model="filter.name" type="text" class="form-control" placeholder="Name">
      </div>
      <div class="col-xs-2">
        <label>Priority</label>
        <select v-model="filter.priority" class="form-control" placeholder="Priority">
          <option selected>None</option>
          <option v-for="n in 5">{{ n }}</option>
        </select>
      </div>
      <div class="col-xs-2">
        <label>Due Date</label>
        <!-- <input v-model="filter.due_date" type="date" class="form-control" placeholder="Due Date"> -->
        <datepicker format="MM/dd/yyyy" v-model="filter.due_date" class="form-control"></datepicker>
      </div>
      <div class="col-xs-2">
        <label>
          <input type="checkbox" v-model="filter.overdue"> Overdue
        </label>
      </div>
      <button class="btn btn-primary" @click="getTasks">Filter</button>
    </div>
    <table class="table">
      <thead>
        <th>Name</th>
        <th>Description</th>
        <th>Priority</th>
        <th>Completed</th>
        <th>Date Due</th>
        <th>Created At</th>
      </thead>
      <tbody class="table-hover">
        <tr v-for="task in tasks">
          <td> {{ task.name }}</td>
          <td> {{ task.description }}</td>
          <td> {{ task.priority }}</td>
          <td> {{ (task.is_completed == true) ? 'Yes' : 'No' }}</td>
          <td> {{ task.due_date_f }}</td>
          <td> {{ task.createdAt_f }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { getTasks } from "../services/tasks";
  import Datepicker from 'vuejs-datepicker';

  export default {
    components: {
      Datepicker
    },
    data () {
      return {
        tasks: [],
        filter: {
          name: '',
          priority: '',
          due_date: '',
          overdue: ''
        }
      }
    },
    mounted(){
      this.getTasks()
    },
    methods: {
      getTasks() {
        getTasks(this.filter)
          .then((resp) => {
            this.tasks = resp.data
            this.tasks.forEach(function(task) {
              // Format Date 
              task.due_date_f = this.$moment(task.due_date).format("dddd, MMMM Do YYYY")
              task.createdAt_f = this.$moment(task.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
            }, this);
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style lang="css">
  thead td {
    font-weight: bold;
  }
</style>