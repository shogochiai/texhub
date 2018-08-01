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
        let cmd = `curl -sL "https://github.com/yihui/tinytex/raw/master/tools/install-unx.sh" | sh`
        console.log(`Setup...`)
        console.log(cmd)
        exec(cmd, dump)
    },

    template: _=>{
        let cmd = `cp -a ${texDir} ../${texDir}`
        console.log(`Template...`)
        console.log(cmd)
        exec(cmd, dump)
    }
}

function dump(err, stdout, stderr) {
    console.log(err, stdout, stderr)
}