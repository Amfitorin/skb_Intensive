import express from 'express';
import cors from 'cors';
const par = require('parse-color');

const zeroString = (str)=>{
  let s = Number(str).toString(16);
  return s.length == 1 ? "0"+s:s;
}
const app = express();
app.use(cors());
app.get('/result2d', (req, res) => {
  let color = req.query.color;
  if (!color)
    res.send( "Invalid color" );
  color = color.trim().toLowerCase().replace(/%20/g, ' ');
    console.log(par(color));
  if (color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)) {
    let match = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    for (var i = 1; i < 4; i++) {
      if ( match[i] < 0 || match[i] > 255)
        res.send( "Invalid color" );
    }
    res.send( "#" + zeroString(match[1]) +  zeroString(match[2]) +  zeroString(match[3]));
  }
  else if (color.search(/rgb/) != -1) {
    res.send( "Invalid color" );
  }
  else if (par(color).hex && color[0]!='#')
    {
      let col = par(color);
      console.log(col);
      if (!col.hsl || col.hsl[0]< 0 || col.hsl[0] > 360 || col.hsl[1]< 0 || col.hsl[1] > 100 || col.hsl[2]<0 || col.hsl[2]>100 || (!col.rgb[0] && col.rgb[0] != 0) || !color.match(/%/g) || color.match(/%/g).length != 2)
        res.send( "Invalid color" );
      else
        res.send(par(color).hex );
    }
  else if (color.search(/[\s]|^[0-9a-fA-F]{6}$/) != -1) {
    let index = color.search(/[\s]|^[0-9a-f]{6}$/);
    console.log(index, color,"six" );
    let colStr = color.slice(index, index + 6);
    res.send( "#" + colStr);
  }
  else if (color.search(/[\s]|^#[0-9a-fA-F]{6}$/) != -1)
    {
      res.send( color );
    }
  else if (color.search(/[\s]|^[0-9a-fA-F]{3}$/) != -1)
    {
      let index = color.search(/[\s]|^[0-9a-fA-F]{3}$/);
      console.log(index, color, "Tree");
      let colStr = color.slice(index, index + 3);
      res.send( "#" + colStr[0]+ colStr[0]+ colStr[1]+colStr[1] + colStr[2]+colStr[2] );
    }
  else if (color.search(/[\s]|^#[0-9a-fA-F]{3}$/) != -1)
    {
      res.send( "#" + color[1]+ color[1]+ color[2]+color[2] + color[3]+color[3] );
    }
  else
    res.send( "Invalid color" );
});

app.listen(3002, () => {
  console.log('Your app listening on port 3000!');
});
