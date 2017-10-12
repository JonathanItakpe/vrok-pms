module.exports = (app) => {
  app.use('/project', require('./project'))
  app.use('/task', require('./task'))
  app.use('/subtask', require('./subtask'))
}