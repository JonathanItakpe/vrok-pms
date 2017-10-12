import axios from 'axios'

export const allProjects = () => {
  return axios.get('/project')
    .then((response) => {
      return response.data
    }).catch((error) => {
      return error
    })
}

export const getProjectById = (id) => {
  return axios.get(`/project/${id}`)
    .then((response) => {
      return response.data
    }).catch((error) => {
      return error
    })
}

export const createProject = (data) => {
  return axios.post('/project', data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const updateProject = (id, data) => {
  return axios.put(`/project/${id}`, data)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}

export const deleteProject = (id) => {
  return axios.delete(`/project/${id}`)
  .then((response) => {
    return response.data
  }).catch((error) => {
    return error
  })
}