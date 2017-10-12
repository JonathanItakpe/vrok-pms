import axios from 'axios'
import {serialize} from '../helper'

export const getSubTasksByTaskId = (id, options) => {
  let url = `/task/${id}/subtasks`
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

export const createSubTask = (data) => {
  return axios.post('/subtask', data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const updateSubTask = (id, data) => {
  return axios.put(`/subtask/${id}`, data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const deleteSubTask = (id) => {
  return axios.delete(`/subtask/${id}`)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}