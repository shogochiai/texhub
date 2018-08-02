# Blankpaper

Install: `npm i blankpaper --save`

Set three commands.
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


LaTeX installation: `npm run setup`
Template Files Generation: `npm run template`
PDF Generation: `npm start`