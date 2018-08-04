const spawn = require('child-process-promise').spawn

function run(cmd){
    console.log(`Smoke test: ${cmd}`)
    return new Promise((resolve, reject)=>{
        let proc = spawn("sh", ["-c", cmd]).childProcess

        proc.on('close', function (data) {
            if(parseInt(data) === 0) resolve(data)
            else reject(`FAILED: ${cmd}`)
        })

        proc.stdout.on("data", data=>{ console.log(data.toString()) })
    
        proc.on('error', function (data) {
            console.error(data)
            reject(`FAILED: ${cmd}`)
        })
    })
}


run(`node index.js setup`)
.then(_=> run(`node index.js install`) )
.then(_=> run(`node index.js template`) )
.then(_=> run(`node index.js build`) )
.catch(err=> console.error(err) )