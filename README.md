# Blankpaper

## Installation
`npm i blankpaper --save`

## Command utilization
```:json
{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
    "start":"blankpaper build",
    "reset":"blankpaper template",
    "setup":"blankpaper setup"
  },
  "dependencies": {
    "blankpaper": "^1.0.0"
  }
}
```
## How to use
- LaTeX installation: `npm run setup`
- Template Files Generation: `npm run template`
- PDF Generation: `npm start`

## How the Blankpaper based project looks like (for your confirmation)
```
package.json
package-lock.json
node_modules
tex            <--- Your genius idea is here!
.bulk          <--- Intermediate concatenated tex texts
whitepaper.pdf <--- Your fans will read this!
```
