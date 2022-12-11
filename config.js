const firebase = require("firebase")
const firebaseConfig = {
    imdbApiKey :proprocess.env.IMDB_API_KEY,
    midtransApiKey: process.env.MIDTRANS_API,
    watchModeApiKey: process.env.WATCHMODE_API_KEY,
    watchMode2ApiKey:process.env.WATCHMODE2_API_KEY,
    ottApiKey:process.env.OTT_API_KEY,
    secretKey:process.env.SECRET_KEY,
    databaseUrl:process.env.DATABASE_URL
}
