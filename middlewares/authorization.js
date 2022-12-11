
const {UserMovie} = require('../models/index.js')
const authorization = async (req, res, next) => {//authorization
    //bila author berbeda dengan login dan author bukan admin, tolak access 
    try {
       
        let idMovie = req.params.imdbId
        //ambil data dari authentication
        let userLoginId = req.loginUser.id
        
        console.log(idMovie, " INI  MOVIE ID")
        console.log(userLoginId, " INI  USER ID")
        
        const purchased = await UserMovie.findOne({
            where : {
                UserId : userLoginId,
                ImdbId: idMovie 
            }
        })
        console.log(purchased, " INI  PURCHASED")
        if (!purchased) {
            throw({
                code: 404,
                name: "NOT_FOUND",
                message: "Movie Not Found"
            })
        }
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = authorization