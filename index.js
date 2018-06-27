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
    static generator(json={}){
        if(!json.email || !json.patterns ){
            throw new Error("Invalid json provided")
        }

        let _$ = {
            accountName : process.env.LIMELIGHT_ACCOUNT_NAME,
            username: process.env.LIMELIGHT_USERNAME,
            sharedKey: process.env.LIMELIGHT_KEY,
            json
        }

        return new LimeLightPurge(_$.accountName, _$.username, _$.sharedKey, _$.json)
    }

    /**
     *
     * @param accountName Limelight account name ("shortname")
     * @param username Limelight username
     * @param sharedKey Limelight shared key associated with username
     * @param json Object with 2 mandatory fields
     */
    constructor(accountName, username, sharedKey, json={}, debug = false){
         if(typeof sharedKey !== 'string'){
             throw new Error('Please provide sharedKey')
         }

         if(!(typeof json === "object" && !Array.isArray(json) && json.email && json.email.subject && json.email.to && Array.isArray(json.patterns))){
             throw new Error('Please provide valid json (payload) ')
         }

        this._username = username;
        this._accountName = accountName;
        this._sharedKey = sharedKey;
        this._json = json;
        this._serviceUrl = serviceUrlGenerator(this._accountName);
        this._timestamp = (new Date()).getTime();
        this._requestBody = this.generateRequestBody();
        this._debug = debug;

        if(this._debug){
            console.log(this._requestBody)
        }
     }


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
        // console.log("_tokenString", _tokenString)
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
        return new Promise((resolve, reject)=>{
            Request(this._requestBody, function(error, response, body) {
                if (error || response.statusCode < 200 || response.statusCode >= 300) {

                    if(this._debug){
                        console.log(error, response, body)
                    }

                    reject(error);
                }else{
                    resolve(body);
                }
            })
        })
    }

}

module.exports = LimeLightPurge;