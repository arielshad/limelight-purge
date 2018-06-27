# Limelight Purger
Basic CDN [LimeLight] node.js promised and env variables based purge wrapper developed for [AnyClip]
### Installation
Install package
```sh
$ npm i limelight-purge@latest --save
```

Create .env file (Optional)

```sh
$ vi .env
~ LIMELIGHT_ACCOUNT_NAME={{LIMELIGHT_ACCOUNT_NAME}}
~ LIMELIGHT_USERNAME={{LIMELIGHT_USERNAME}}
~ LIMELIGHT_KEY={{SHARED_KEY}}
```

### Usage

Examples can be found in test folder

```javascript

const Purger = require("limelight-purge")
//Create json payload for request
let _jsonPayload = {
    patterns : [
        {
            pattern: "http://anyclip-lre-player-dev.s3.amazonaws.com/config/*",
            evict: true,
            exact: false,
            incqs: false
        }
    ],
    email : {
        subject: "Purge Done.",
        to: "ariels@anyclip.com"
    }
};

//init variables from .env
const accountName  = process.env.LIMELIGHT_ACCOUNT_NAME
const username = process.env.LIMELIGHT_USERNAME
const sharedKey = process.env.LIMELIGHT_KEY
const json = _jsonPayload

//init Purger
const _purger = new Purger(accountName, username, sharedKey, json)

//Run, promised based in async function block can be used with await
_purger.run()
    .then(res=>console.log(res))
    .catch(err=>console.log(err))

```



   [LimeLight]: <https://www.limelight.com>
   [AnyClip]: <https://www.anyclip.com>
   [![N|Solid](https://anyclip.com/wp-content/uploads/2017/05/AnyClip-logo-orange.png)](http://www.anyclip.com)

