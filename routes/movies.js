const Controller = require ('../controllers/movieController')
const express = require("express")
const router = express.Router()
const authorization = require('../middlewares/authorization')


router.get('/', Controller.getTopFive)
router.get('/search', Controller.searchMovie)
router.get('/:imdbId', Controller.getMovieDetails)
router.get('/price/:imdbId', Controller.getMoviePricesAndTrailer)

router.get('/purchased/all', Controller.getPurchased)
router.get('/purchased/:imdbId', authorization, Controller.getMyMovie)
router.post('/purchased/:imdbId', Controller.addToPurchased)


module.exports = router