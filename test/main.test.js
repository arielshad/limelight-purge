const Purger = require("../index")


let patterns = [
    {
        pattern: "http://anyclip-lre-player-dev.s3.amazonaws.com/config/*",
        evict: true,
        exact: false,
        incqs: false
    }
]

let email = {
    subject: "Purge Done.",
    to: "ariels@anyclip.com"
}

const DEBUG_ON = true;

describe("Main test suite", function () {
    it("generate instace of Purger and run it", async (done) => {

        let accountName  = process.env.LIMELIGHT_ACCOUNT_NAME,
            username = process.env.LIMELIGHT_USERNAME,
            sharedKey = process.env.LIMELIGHT_KEY,
            json = {
                patterns,
                email
            }

        let _purger = new Purger(accountName, username, sharedKey, json, DEBUG_ON)
        let res = await _purger.run()
        console.log(res)


        done()
    })

    it('should run Purger Generator ', async () => {
        try {
            let res = await Purger.generator({
                patterns,
                email
            }).run()
            console.log(res)
        } catch (err) {
            console.log(err)
            throw err;
        }
    })
})