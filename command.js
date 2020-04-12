require("dotenv").config();

const LATEX_END = "\\end{document}";
const fs = require("fs");
const LANG = process.env.LANG || "";
const PDF_NAME = "whitepaper" + (LANG ? `.${LANG}` : "");
const texDir = LANG ? `tex_${LANG}` : "tex";
const translatorFile = process.env.TRANSLATORS_FILE_NAME;
const contributorFile = process.env.CONTRIBUTORS_FILE_NAME;
const hasFooter = translatorFile || contributorFile;
const TEXBINDIR = "./texlive/bin/x86_64-darwin";

let footer = "";
const exec = require("child-process-promise").exec;
const spawn = require("child-process-promise").spawn;

module.exports = {
  build: async (_) => {
    try {
      await _pkgsync();
      // Concat sections
      let listTex = fs.readdirSync(`./${texDir}`);
      let body = listTex
        .map((n) => fs.readFileSync(`./${texDir}/${n}`))
        .join("\n");

      if (hasFooter) {
        let translatorsBlock = fs
          .readFileSync(translatorFile)
          .toString()
          .split("\n")
          .map((t) => t.replace(/  /, " / "))
          .join("\n");
        let contributersBlock = fs.readFileSync(contributorFile);

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
            `.replace(/\n/g, "\n\n"); //latex way. empty line is \\
      }

      // Make it bulk and save as hidden file
      let bulk = `${body}\n${footer}\n${LATEX_END}`;
      fs.writeFileSync(".bulk", bulk);

      // Bake PDF
      await cmd(
        `${TEXBINDIR}/pdflatex --jobname=${PDF_NAME} .bulk`,
        false
      ).catch((e) => console.error(e));

      // Logging
      console.log("Generating... \n");
      console.log(`  > ${PDF_NAME}.pdf \n`);
      await cmd(`rm ${PDF_NAME}.aux ${PDF_NAME}.log *.sty`);
    } catch (e) {
      await cmd(`rm ${PDF_NAME}.aux ${PDF_NAME}.log *.sty`);
    }
    return true;
  },

  setup: async (_) => {
    let errcode = 0;
    errcode = await cmd(
      'curl -sL "https://yihui.org/gh/tinytex/tools/install-base.sh"'
    ).catch(() => 1);
    errcode = await cmd(
      `${TEXBINDIR}/tlmgr install luahbtex collection-fontsrecommended`,
      false
    ).catch(() => 2);
    errcode = await cmd(
      'curl -sL "https://github.com/yihui/tinytex/raw/master/tools/install-unx.sh"'
    ).catch(() => 3);
    console.log(`setup errcode ${errcode}`);
    return errcode;
  },
  pkgsync: async (_) => {
    await _pkgsync();
  },
  template: async (_) => {
    let cmd = `mkdir -p ${texDir}`;
    cmd += " && ";
    cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/00a_Header -o ${texDir}/00a_Header`;
    cmd += " && ";
    cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/00b_Abstract -o ${texDir}/00b_Abstract`;
    cmd += " && ";
    cmd += `curl https://raw.githubusercontent.com/cryptoeconomicslab/texhub/master/tex/01_template -o ${texDir}/01_template`;
    console.log(`Template...`);
    console.log(cmd);
    await exec(cmd, dump);
  },

  install: (_) => {
    console.log(require("fs").readFileSync("Texfile").toString());
    let packages = require("fs")
      .readFileSync("Texfile")
      .toString()
      .replace(/\n/g, " ");
    return cmd(`tlmgr install ${packages} && texhash`, false).catch((e) =>
      console.error(e)
    );
  },
};

function dump(err, stdout, stderr) {
  console.log(err, stdout, stderr);
}

function run(cmd) {
  return spawn("sh", ["-c", cmd]);
}

function cmd(c, isExec = true) {
  let _cmd = run(c + `${isExec ? " | sh" : ""}`);
  let childProcess = _cmd.childProcess;
  childProcess.stdout.on("data", function (data) {
    console.log("stdout: " + data.toString());
  });

  childProcess.stderr.on("data", function (data) {
    console.error("stderr: " + data.toString());
  });
  return _cmd;
}

async function _pkgsync() {
  await cmd("kpsewhich `head -n 1 Texfile`.sty > .kpsepath", false);
  await cmd(
    "cat .kpsepath | sed -e 's/\\/[a-zA-Z0-9]*\\/[a-zA-Z0-9]*\\.sty$//g' > .kpsedir",
    false
  );
  await cmd(
    "ls /Users/sg/Library/TinyTeX/texmf-dist/tex/latex/*/*sty | xargs -I{} ln -s {} ./",
    false
  );
}
