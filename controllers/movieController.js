const { User, UserMovie, Genres } = require('../models/index')
const IMDB_KEY = process.env.IMDB_API_KEY
const WM2_KEY = process.env.WATCHMODE2_API_KEY
const imdb = require('../apis/imdb-api')
const watchMode2 = require('../apis/watchMode2')
const {convertUsdPriceToIdr} =  require('../helpers/usdToIdr')


class Controller {
    static async getTopFive(req, res, next) {
        try {
            console.log(IMDB_KEY, "INI IMDB KEY")
            const response = await imdb.get(`/AdvancedSearch/${IMDB_KEY}?title_type=feature&release_date=2020-12-01,2022-03-18&groups=top_1000&countries=us&sort=moviemeter,desc&count=5`)
            const fiveMovies = response.data
            console.log(fiveMovies, "INI TOP 5 MOVIES")
            res.status(200).json(fiveMovies)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async searchMovie(req, res, next) {
        try {
            const { page, title, genre } = req.query
            let movieTitle = ''
            let startpage = 1
            if (page) {
                startpage = page
            }
            if (title) {
                movieTitle = title
            }

            const response = await imdb.get(`/AdvancedSearch/${IMDB_KEY}?title_type=feature&release_date=1960-12-01,2022-03-18&countries=us&genres=${genre}&title=${movieTitle}&sort=boxoffice_gross_us,desc&count=100`)
            const searchMovie = response.data

            let startArray = 0 + ((startpage - 1) * 10)
            let endArray = startArray + 10
            console.log(startArray, endArray)
            const sliced = searchMovie.results.slice(startArray, endArray)
            //console.log(sliced, "INI HASIL SEARCH")
            const totalPages = Math.ceil(response.data.results.length/10)
            console.log(response.data.results.length, "TOTAL MOVIE SEARCH")
            res.status(200).json({
                totalPages: totalPages,
                page: page,
                results: sliced
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async getMovieDetails(req, res, next) {
        try {
            const { imdbId } = req.params
            const response = await imdb.get(`Title/${IMDB_KEY}/${imdbId}`)
            const MovieDetails = response.data
            console.log(MovieDetails)
            res.status(200).json(MovieDetails)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async getMoviePricesAndTrailer(req, res, next) {
        try {
            const { imdbId } = req.params
            const response = await watchMode2.get(`v1/title/${imdbId}/details/?apiKey=${WM2_KEY}&append_to_response=sources`)
            // const movieTrailer = 
            const trailerLink = response.data.trailer
            const trailerLinkEmbed = trailerLink.replace('watch?v=', 'embed/')

            const sources = response.data.sources
            let sourcePriceRent = sources.find(element => {
                //console.log(element.type)
                return element.price && element.type == 'rent' && element.region == 'US'

            });

            let sourcePriceBuy = sources.find((element) => {
                //console.log(element.type)
                return element.price && element.type == 'buy' && element.region == 'US'

            });



            if (!sourcePriceRent) {
                sourcePriceRent = {
                    price: 3.59
                }
            }
            if (!sourcePriceBuy) {
                sourcePriceBuy = {
                    price: 12.59
                }
            }

            //console.log(sourcePriceRent, sourcePriceBuy)
            const rentIdr = await convertUsdPriceToIdr(sourcePriceRent.price)
            const buyIdr = await convertUsdPriceToIdr(sourcePriceBuy.price)
            //console.log(rentIdr, buyIdr)
            console.log({
                trailer: trailerLinkEmbed,
                rent: rentIdr,
                buy: buyIdr,

            })
            res.status(200).json({
                trailer: trailerLinkEmbed,
                rent: rentIdr,
                buy: buyIdr,

            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async getMyMovie(req, res, next) {
        try {
            const { imdbId } = req.params
            const { id, username } = req.loginUser

            const myMovie = await UserMovie.findOne({
                where: { 
                    UserId: id ,
                    ImdbId: imdbId
                },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: {
                            exclude: ["password"]
                        }
                    },

                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            })
            if(!myMovie) {
                throw ({
                    code: 404,
                    name: "NOT_FOUND",
                    message: "Movie not found"
                })
            }
            
            res.status(200).json(myMovie)
        } catch (error) {
            console.log(error, "INI ERROR")
            next(error)
        }
    }

    static async getPurchased(req, res, next) {
        try {
            const { id, username } = req.loginUser
            console.log(id, username, "dari getPurchased")
            const myMovies = await UserMovie.findAll({
                where: { UserId: id },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: {
                            exclude: ["password"]
                        }
                    },

                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            })
            console.log(JSON.stringify(myMovies), "___________>>MYLIST")
            if (myMovies) {
                console.log(JSON.stringify(myMovies), "___________>>MYLIST2")
                res.status(200).json(myMovies)
                console.log(JSON.stringify(myMovies), "___________>>MYLIST3")
            } else {
                throw ({
                    code: 404,
                    name: "NOT_FOUND",
                    message: "No Movies found"
                })
            }
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async addToPurchased(req, res, next) {
        try {
            const { imdbId } = req.params
            const {title, synopsis, imageUrl, trailerUrl } = req.body

            const { id } = req.loginUser
            console.log(id, imdbId, "dari addToPurchased")


            const userMovie = await UserMovie.findOne({
                where: {
                    UserId: id,
                    ImdbId: imdbId
                }
            })
            if (!userMovie) {
                const addToMyPurchased = await UserMovie.create({
                    title : title,
                    synopsis: synopsis,
                    imageUrl : imageUrl,
                    trailerUrl: trailerUrl,
                    ImdbId: imdbId,
                    UserId: id, 
                    
                })
                console.log(addToMyPurchased, "INI ADD TO MY PURCHASED")
                res.status(201).json(addToMyPurchased)
            } else {
                throw ({
                    code: 400,
                    name: "PURCHASE_DUPLICATE",
                    message: "This Movie has already been purchased"
                })
            }


        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async getGenres(req, res, next) {
        try {
            const genres = await Genres.findAll()
            //console.log(categories[0])
            res.status(200).json(genres)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }


}

module.exports = Controller