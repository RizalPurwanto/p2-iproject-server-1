const axios = require('axios')
const api = "https://api.exchangerate-api.com/v4/latest/USD";

 async function convertUsdPriceToIdr (usd) {
     try {
         const currency =await axios.get(`${api}`)
         let rates =await currency.data.rates.IDR
         let priceInIdr = usd * rates
        let roundedPrice = Math.floor(priceInIdr/1000)*1000
        let formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          
           
          });
          
          let priceIdrFormat = formatter.format(roundedPrice)
          //console.log(priceIdrFormat)
          return roundedPrice
     } catch (error) {
        console.log(err)
     }
    
    

}

convertUsdPriceToIdr(3.99)

module.exports = {
    convertUsdPriceToIdr
}