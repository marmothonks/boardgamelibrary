// repository.js
'use strict'
// factory function, that holds an open connection to the db,
// and exposes some functions for accessing the data.
const repository = (db) => {
  
  // since this is the boardGames-service, we already know
  // that we are going to query the `boardGames` collection
  // in all of our functions.
  const collection = db.collection('boardGames')

  const getBoardGameParties = () => {
    return new Promise((resolve, reject) => {
      const boardGames = []
      const query = {
        party: {
          $e: true
        }
      }
      const cursor = collection.find(query)
      const addBoardGame = (boardGame) => {
        boardGames.push(boardGame)
      }
      const sendBoardGames = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all boardGames, err:' + err))
        }
        resolve(boardGames)
      }
      cursor.forEach(addBoardGame, sendBoardGames)
    })
  }

  const getBoardGameById = (id) => {
    return new Promise((resolve, reject) => {
      const projection = { _id: 0, id: 1, title: 1, format: 1 }
      const sendBoardGame = (err, boardGame) => {
        if (err) {
          reject(new Error(`An error occured fetching a boardGame with id: ${id}, err: ${err}`))
        }
        resolve(boardGame)
      }
      // fetch a boardGame by id -- mongodb syntax
      collection.findOne({id: id}, projection, sendBoardGame)
    })
  }
  
  // this will close the database connection
  const disconnect = () => {
    db.close()
  }

  return Object.create({
    getAllBoardGames,
    getBoardGameParties,
    getBoardGameById,
    disconnect
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection))
  })
}
// this only exports a connected repo
module.exports = Object.assign({}, {connect})