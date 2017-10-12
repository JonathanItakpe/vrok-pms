<template>
  <div>
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

  export default {
    data () {
      return {
        tasks: []
      }
    },
    mounted(){
      this.getTasks()
    },
    methods: {
      getTasks() {
        getTasks()
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