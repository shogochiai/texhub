# Caution
- Body text oftenly needs escape.
  - `-_%$\#` are oftenly involved within URL. And this syntax error is not informative.
  - Count of `\section{}` `\subsection` has meaning. Carefully use it and confirm print result.

## For Japanese charactor
- Run `git clone https://github.com/zr-tex8r/BXjscls.git` and read README
  - You need to ready `texmf` dir. Detail: https://tex.stackexchange.com/a/10256
    - In my case, `mkdir -p ~/Library/texmf/tex/latex/bxjscls ~/Library/texmf/source/latex/bxjscls ~/Library/texmf/doc/latex/bxjscls` is needed
- [tex/00a_Header](./tex/00a_Header#L1)'s first line `\documentclass[12pt,twoside,a4paper,pdflatex,ja=standard]{bxjsarticle}` is initiator of Japanese option。You can render Japanese charactor by `node index.js`
