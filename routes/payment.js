const {mtGenerateTransactionToken} = require ('../controllers/paymentController')
const express = require("express")
const router = express.Router()

router.post('/:imdbId', mtGenerateTransactionToken)

module.exports = router