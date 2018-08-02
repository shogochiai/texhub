require('dotenv').config()

const latex = require('node-latex')
const LATEX_END = '\\end{document}'
const fs = require('fs')
const PDF_NAME = "whitepaper.pdf"
const texDir = process.env.TEX_DIR || "tex"
const translatorFile = process.env.TRANSLATORS_FILE_NAME
const contributorFile = process.env.CONTRIBUTORS_FILE_NAME
const hasFooter = translatorFile || contributorFile

let footer = ""
const exec = require('child_process').exec
const spawn = require('child_process').spawn

module.exports = {
    build: _=>{
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
        pdf.on('error', err => console.error(err))
        pdf.pipe(output)

        // Logging
        console.log("Generating... \n")
        console.log("  > "+PDF_NAME+"\n")
    },

    setup: _=>{

        let curl = spawn("sh", ["-c", 'curl -sL "https://github.com/yihui/tinytex/raw/master/tools/install-unx.sh" | sh'])
        curl.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });

        curl.stderr.on('data', function (data) {
            console.log('stderr: ' + data.toString());
        });

        curl.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
        });
    },

    template: _=>{
        let cmd = `mkdir -p ${texDir}`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/blankpaper/master/tex/00a_Header -o ${texDir}/00a_Header`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/blankpaper/master/tex/00b_Abstract -o ${texDir}/00b_Abstract`
        cmd += " && "
        cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/blankpaper/master/tex/01_template -o ${texDir}/01_template`
        console.log(`Template...`)
        console.log(cmd)
        exec(cmd, dump)
    }
}

function dump(err, stdout, stderr) {
    console.log(err, stdout, stderr)
}
