const Purger = require("../index")

describe("Main test suite", function () {
    it("generate instace of Purger", async (done) => {
        let _purger = new Purger()
        let res = await _purger.run()
        console.log(res)
        done()
    })
})