# texhub

## Installation
`npm i texhub --save`

## package.json recommendation
```:json
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
    "build":"texhub build",
    "reset":"texhub template",
    "setup":"texhub setup && texhub install"
  },
  "dependencies": {
    "texhub": "^1.0.0",
    "node": "~9.9.0"
  },
  {
    "devDependencies": {
    "pre-commit": "^1.2.2"
  },
  "pre-commit": [
    "build"
  ]
}
```
## How to use
- LaTeX installation: `npm run setup`
- Tex Package installation: `npm run install` <--- Write definition on `Texfile` via newline separated format
- Template Files Generation: `npm run template`
- PDF Generation: `npm run build`

## How the texhub based project looks like (for your confirmation)
```
package.json
package-lock.json
node_modules
tex            <--- Your genius idea is here!
.bulk          <--- Intermediate concatenated tex texts
whitepaper.pdf <--- Your fans will read this!
```
