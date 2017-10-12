import axios from 'axios'
import {serialize} from '../helper'

export const getTasksByProjectId = (id, options) => {
  let url = `/project/${id}/tasks`
  if(options){
    url += serialize(options)
  }
  
  return axios.get(url)
    .then((response) => {
      return response.data
    }).catch((error) => {
      return error
    })
}

export const getTasks = (options) => {
  let url = `/task`
  if(options){
    url += serialize(options)
  }
  
  return axios.get(url)
    .then((response) => {
      return response.data
    }).catch((error) => {
      return error
    })
}

export const getTaskById = (id) => {
  return axios.get(`/task/${id}`)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const createTask = (data) => {
  return axios.post('/task', data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const updateTask = (id, data) => {
  return axios.put(`/task/${id}`, data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const deleteTask = (id) => {
  return axios.delete(`/task/${id}`)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}