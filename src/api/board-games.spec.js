/* eslint-env mocha */
const request = require('supertest')
const server = require('../server/server')

describe('Board Games API', () => {
    let app = null
    let testBoardGame = [{
        'id': '3',
        'title': 'Werewolves',
        'party': true,
        'minPlayers': 6,
        'maxPlayers': 20,
        'duration': 30,
        'materialNeeded': false
    }, {
        'id': '4',
        'title': 'Love Letter',
        'party': true,
        'minPlayers': 3,
        'maxPlayers': 4,
        'duration': 30,
        'materialNeeded': true
    }, {
        'id': '1',
        'title': 'Settlers of Catane',
        'party': false,
        'minPlayers': 3,
        'maxPlayers': 4,
        'duration': 60,
        'materialNeeded': true
    }]

    let testRepo = {
        getAllBoardGames() {
            return Promise.resolve(testBoardGames)
        },
        getBoardGameParties() {
            return Promise.resolve(testBoardGames.filter(boardGame => boardGame.minPlayers === 5))
        },
        getBoardGameById(id) {
            return Promise.resolve(testBoardGames.find(boardGame => boardGame.id === id))
        }
    }

    beforeEach(() => {
        return server.start({
            port: 3000,
            repo: testRepo
        }).then(serv => {
            app = serv
        })
    })

    afterEach(() => {
        app.close()
        app = null
    })

    it('can return all board games', (done) => {
        request(app)
            .get('/boardgames')
            .expect((res) => {
                res.body.should.containEql({
                    'id': '1',
                    'title': 'Settlers of Catane',
                    'party': false,
                    'minPlayers': 3,
                    'maxPlayers': 4,
                    'duration': 60,
                    'materialNeeded': true
                })
            })
            .expect(200, done)
    })

    it('can get party board games', (done) => {
        request(app)
            .get('/boardgames/parties')
            .expect((res) => {
                res.body.should.containEql({
                    'id': '4',
                    'title': 'Love Letter',
                    'party': true,
                    'minPlayers': 3,
                    'maxPlayers': 4,
                    'duration': 30,
                    'materialNeeded': true
                })
            })
            .expect(200, done)
    })

    it('returns 200 for an known board game', (done) => {
        request(app)
            .get('/boardgames/4')
            .expect((res) => {
                res.body.should.containEql({
                    'id': '4',
                    'title': 'Love Letter',
                    'party': true,
                    'minPlayers': 3,
                    'maxPlayers': 4,
                    'duration': 30,
                    'materialNeeded': true
                })
            })
            .expect(200, done)
    })
})