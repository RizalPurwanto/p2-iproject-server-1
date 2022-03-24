require("dotenv").config();
const snap  = require('https://app.sandbox.midtrans.com/snap/snap.js')
const IMDB_KEY = process.env.IMDB_API_KEY
const WM2_KEY = process.env.WATCHMODE2_API_KEY
const imdb = require('./apis/imdb-api')
const midTrans = require('./apis/midTrans')
const watchMode = require('./apis/watchMode');
const watchMode2 = require('./apis/watchMode2')
const { convertUsdPriceToIdr } = require("./helpers/usdToIdr");
const user = require("./models/user");

async function getTop5Movies() {
    try {
        console.log(IMDB_KEY, "INI IMDB KEY")
        const response = await imdb.get(`/AdvancedSearch/${IMDB_KEY}?title_type=feature&release_date=2020-12-01,2022-03-18&groups=top_1000&countries=us&sort=moviemeter,desc&count=5`)
        const fiveMovies = response.data
        console.log(fiveMovies, "INI TOP 5 MOVIES")
    } catch (error) {
        console.log(error)
    }
}

async function searchMovie(page, title, genre) {
    try {
        let movieTitle = ''
        let startpage = 1
        if (page) {
            startpage = page
        }
        if (title) {
            movieTitle = title
        }

        const response = await imdb.get(`/AdvancedSearch/${IMDB_KEY}?title_type=feature&release_date=1960-12-01,2022-03-18&countries=us&genres=${genre}&title=${movieTitle}&sort=boxoffice_gross_us,desc&count=1000`)
        const searchMovie = response.data

        let startArray = 0 + ((startpage - 1) * 10)
        let endArray = startArray + 10
        console.log(startArray, endArray)
        const sliced = searchMovie.results.slice(startArray, endArray)
        //console.log(sliced, "INI HASIL SEARCH")
        console.log()
    } catch (error) {
        console.log(error)
    }

}

async function getMovieDetails(imdbId) {
    try {
        const response = await imdb.get(`Title/${IMDB_KEY}/${imdbId}`)
        const getMovieDetails = response.data
        console.log(getMovieDetails)
    } catch (error) {
        console.log(error)
    }
}

async function getMovieTrailerAndPrice(imdbId) {
    try {
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
            sourcePriceRent ={
                price:  3.59
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
        
    } catch (error) {
        console.log(error)
    }

}

async function searchSourceById(imdbId) {
    try {


        console.log(imdbId, "INI SOURCE dalam watchmode")
        const { data } = await watchMode.get(`/title/${imdbId}/sources/`)

        let sourcePriceRent = data.find(element => {
            //console.log(element.type)
            return element.price && element.type == 'rent' && element.region == 'US'

        });

        let sourcePriceBuy = data.find((element) => {
            //console.log(element.type)
            return element.price && element.type == 'buy' && element.region == 'US'

        });

        // return {
        //     buy : 0,
        //     rent: 0
        // }
        
        if (!sourcePriceRent) {
            sourcePriceRent ={
                price:  3.59
            }
        }
        if (!sourcePriceBuy) {
            sourcePriceBuy = {
                price: 12.59
            }
        }

        console.log(sourcePriceRent, sourcePriceBuy)
        const rentIdr = await convertUsdPriceToIdr(sourcePriceRent.price)
        const buyIdr = await convertUsdPriceToIdr(sourcePriceBuy.price)
        console.log(rentIdr, buyIdr)
        console.log({
            rent: rentIdr,
            buy: buyIdr,

        })
        //console.log(YtSource, WatchModeId, "INI SOURCE")
        // res.status(200).json(data)
    } catch (err) {
        console.log(err)

    }
}

async function searchByImdbId(field, value) {
    try {
        const searchField = field
        const searchValue = value


        const { data } = await watchMode.get(`/search/?search_field=${searchField}&search_value=${searchValue}&types=tv`)
        console.log(`/search/?search_field=${searchField}&search_value=${searchValue}&types=tv`)
        console.log(data, "INI WATCHMODE")
        // if (data.title_results.length !== 0) {

        //     const YtSource = await searchSourceById(data.title_results[0].id)
        //     // console.log(YtSource, "INI YTSOURCE dalam watchmode")

        //     if(YtSource.length !== 0) {

        //         //console.log(data, "INI DATA YG ADA YTSOURCE NYA")
        //         //console.log(YtSource, "INI YTSOURCE dalam watchmode")
        //         return {movieInfo: data, YtSource: YtSource}
        //     } 

        // } 

        // res.status(200).json(data)
    } catch (err) {
        console.log(err)

    }
}

const movieName = "Finding Nemo"
const movieId = "tt0266543"
const username = 'Anemone'
const userEmail  = 'anemone@mail.com'


const body = {
    "transaction_details": {
      "order_id": `ORDER-102-${new Date().toISOString()}`,
      "gross_amount": 51000
    },
    "credit_card": {
      "secure": true
    },
    "item_details": [{
      "id": `${movieId}`,
      "price": 51000,
      "quantity": 1,
      "name": `${movieName}- rent`
    }],
    "customer_details": {
      "first_name": `${username}`,
      "last_name": `${username}`,
      "email": `${userEmail}`,
      "phone": "",
      "billing_address": {
        "first_name":`${username}`,
        "last_name": `${username}`,
        "email": `${userEmail}`,
        "phone": "",
      "address": "",
      "city": "",
      "postal_code": "",
      "country_code": ""
      },
      "shipping_address": {
        "first_name":`${username}`,
        "last_name": `${username}`,
        "email": `${userEmail}`,
        "phone": "",
      "address": "",
      "city": "",
      "postal_code": "",
      "country_code": ""
      }
    }
  }

  console.log(body, "INI BODY")


async function mtGenerateTransactionToken() {
    try {
      
      
      
      const {data} = await midTrans.post(`/v1/transactions`, body)
      console.log(data, "INI MIDTRANS TRANSACTION TOKEN")
      
    } catch (err) {
      console.log(err.response.data)
    }
  }

  async function mtGenerateTransactionToken(body) {
    try {
      
      
      
      const {data} = await midTrans.post(`/v1/transactions`, body)
      console.log(data, "INI MIDTRANS TRANSACTION TOKEN")
      
    } catch (err) {
      console.log(err.response.data)
    }
  }


//searchByImdbId("imdb_id", "tt0110357")

//getTop5Movies()
//searchMovie(null, null, "Animation")
//searchSourceById("tt6741278")
//getMovieDetails("tt0266543")
//getMovieTrailerAndPrice("tt10872600")
//mtGenerateTransactionToken(body)

module.exports ={
    mtGenerateTransactionToken
}


