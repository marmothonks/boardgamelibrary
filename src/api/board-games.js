'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options
  
  // here we get all the boardGames 
  app.get('/boardgames', (req, res, next) => {
    repo.getAllBoardGames().then(boardGames => {
      res.status(status.OK).json(boardGames)
    }).catch(next)
  })
  
  // here we retrieve only the premieres
  app.get('/boardgames/parties', (req, res, next) => {
    repo.getBoardGameParties().then(boardGames => {
      res.status(status.OK).json(boardGames)
    }).catch(next)
  })
  
  // here we get a boardGame by id
  app.get('/boardgames/:id', (req, res, next) => {
    repo.getBoardGameById(req.params.id).then(boardGame => {
      res.status(status.OK).json(boardGame)
    }).catch(next)
  })
}