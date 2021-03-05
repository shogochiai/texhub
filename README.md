# texhub

Tex GUI eats your storage and it's hard to use!

Texhub offers you a CUI centric experience of Tex.

## Features
- Fexfile-based package manager
- versioning via git
- tinytex-based storage-saving environment

## Installation

- `npm i`
- `npm i -g texhub pdflatex` (tips: for texhub v0.0.13, you have to replace TEXBINDIR to /usr/local/bin in the command.js of texhub)
- `npm start`
- `open whitepaper.pdf`

## How to extend

- Modify template files under `/tex` and `/figs`
- Add some [Tex Packages](https://ctan.org/search) to `/Texfile`
- `npm start` and see compilation result
- `open whitepaper.pdf`

## Note

- You can use English and [Japanese](https://texwiki.texjp.org/?BXjscls) at least. But haven't confirmed other languages. Conribution is always welcome and email me we you did some hack to ping me! (shogo.ochiai@protonmail.com)
