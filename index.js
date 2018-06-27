//INIT .env
require('dotenv').config()

const Crypto = require('crypto');
const Request = require("request");


//CONSTANTS
const SHA256 = 'sha256';
const HEX = 'hex';
const POST = 'POST';
const GET = 'GET';

//HEADERS
SECURITY_HEADER_USERNAME = 'X-LLNW-Security-Principal'
SECURITY_HEADER_TIMESTAMP = 'X-LLNW-Security-Timestamp'
SECURITY_HEADER_TOKEN = 'X-LLNW-Security-Token'


//Generate serviceUrl for purge
/**
 * Generate string
 * @param accountName
 * @returns {string}
 */
const serviceUrlGenerator = (accountName)=> `http://purge.llnw.com/purge/v1/account/${accountName}/requests`;

class LimeLightPurge{

    static generator(){

    }

     constructor(
         accountName,
         username,
         sharedKey,
         json={}
     ){
         if(typeof sharedKey !== 'string'){
             throw new Error('Please provide sharedKey')
         }

         //TODO
         if(!(typeof json === "object" && !Array.isArray(json))){
             throw new Error('Please provide valid json (payload) ')
         }

        this._username = username;
        this._accountName = accountName;
        this._sharedKey = sharedKey;
        this._json = json;
        this._serviceUrl = serviceUrlGenerator(this._accountName);
        this._timestamp = (new Date()).getTime();
    }

    //REQ_METHOD+URL+TIMESTAMP+JSON
    buildTokenDataString(){
         return `${POST}${this._serviceUrl}${this._timestamp}${JSON.stringify(this._json)}`;
    }

    generateToken(dataString){
        // return this._macTokenGenerator.update(dataString).digest(HEX);
        let key = new Buffer(this._sharedKey, "hex");

        return Crypto.createHmac("sha256", key).update(dataString).digest("hex");
    }

    generateHeadersRequestOptions() {
         let _tokenString = this.buildTokenDataString();
        console.log("_tokenString", _tokenString)
        return {
            // url: this._serviceUrl,
            headers: {
                [SECURITY_HEADER_USERNAME]: this._username,
                [SECURITY_HEADER_TIMESTAMP]: this._timestamp,
                [SECURITY_HEADER_TOKEN]: this.generateToken(_tokenString),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }

        };
    }

    generateRequestBody(){
        let _reqOptions = this.generateHeadersRequestOptions()
         return {method: POST, uri: this._serviceUrl, ..._reqOptions, body: JSON.stringify(this._json)}

    }

    async run(){
        let data = this.generateRequestBody();
        return new Promise((resolve, reject)=>{
            Request(data, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            })
        })
    }

}



let patterns = [
    {
        pattern: "http://anyclip-lre-player-dev.s3.amazonaws.com/config/*",
        evict: true,
        exact: false,
        incqs: false
    },
    {
        pattern: "http://anyclip-lre-player-dev.s3.amazonaws.com/config/!*!/!*",
        evict: true,
        exact: false,
        incqs: false
    },
    {
        pattern: "http://anyclip-lre-player-dev.s3.amazonaws.com/config/!*!/!*!/!*",
        evict: true,
        exact: false,
        incqs: false
    }
]

let email = {
    subject: "Purge Done.",
    to: "ariels@anyclip.com"
}


module.exports = LimeLightPurge;
