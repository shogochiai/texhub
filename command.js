require('dotenv').config()

const latex = require('node-latex')
const LATEX_END = '\\end{document}'
const fs = require('fs')
const streamToPromise = require('stream-to-promise')
const PDF_NAME = "whitepaper.pdf"
const texDir = process.env.TEX_DIR || "tex"
const translatorFile = process.env.TRANSLATORS_FILE_NAME
const contributorFile = process.env.CONTRIBUTORS_FILE_NAME
const hasFooter = translatorFile || contributorFile

let footer = ""
const exec = require('child-process-promise').exec
const spawn = require('child-process-promise').spawn

module.exports = {
    build: async _=>{
        // Concat sections
        let listTex = fs.readdirSync(`./${texDir}`)
        let body = listTex.map(n=> fs.readFileSync(`./${texDir}/${n}`) ).join("\n")

        if(hasFooter) {
            let translatorsBlock = fs.readFileSync(translatorFile).toString().split('\n').map(t=> t.replace(/  /, ' / ') ).join('\n')
            let contributersBlock = fs.readFileSync(contributorFile)
            
            // Transalators and Contributors
            footer = `
            \\pagebreak
            \\Large{Special Thanks}
            \\
            \\
            \\small{Technical Transalators}
            \\
            \\scriptsize{${translatorsBlock}}
            \\
            \\
            \\
            \\small{Contributors}
            \\
            \\scriptsize{${contributersBlock}}
            `.replace(/\n/g, '\n\n')//latex way. empty line is \\
        }

        // Make it bulk and save as hidden file
        let bulk = `${body}\n${footer}\n${LATEX_END}`
        fs.writeFileSync('.bulk', bulk)

        // Bake PDF
        const input = fs.createReadStream('.bulk')
        const output = fs.createWriteStream(PDF_NAME)
        const pdf = latex(input)
        const result = await streamToPromise(pdf).catch(e=> console.error(e) )
        fs.writeFileSync(PDF_NAME, result)

        // Logging
        console.log("Generating... \n")
        console.log("  > "+PDF_NAME+"\n")
        return result
    },

    setup: _=>{
        let curl = run('curl -sL "https://github.com/yihui/tinytex/raw/master/tools/install-unx.sh" | sh')
        let childProcess = curl.childProcess
        childProcess.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });

        childProcess.stderr.on('data', function (data) {
            console.error('stderr: ' + data.toString());
        });

        return curl
    },

    template: async _=>{
        let cmd = `mkdir -p ${texDir}`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/00a_Header -o ${texDir}/00a_Header`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/00b_Abstract -o ${texDir}/00b_Abstract`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/01_template -o ${texDir}/01_template`
        console.log(`Template...`)
        console.log(cmd)
        await exec(cmd, dump)
    },

    install: _=>{
console.log(require("fs").readFileSync("Texfile").toString())
        let packages = require("fs").readFileSync("Texfile").toString().replace(/\n/g, " ")
        let cmd = `tlmgr install ${packages}`
        let install = run(cmd)
        let childProcess = install.childProcess
        childProcess.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });

        childProcess.stderr.on('data', function (data) {
            console.error('stderr: ' + data.toString());
        });

        return install
    }
}

function dump(err, stdout, stderr) {
    console.log(err, stdout, stderr)
}

function run(cmd) {
  return spawn("sh", ["-c", cmd])
}
