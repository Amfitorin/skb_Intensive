import express from 'express';
import cors from 'cors';
import 'isomorphic-fetch';


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
    console.log( pc );
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });



const toJSON = function ( param, res ){
  if ( param === '/length' )
    res.send(pc.length.toString());
  let obj = pc;
  const requests = param.split('/');
  requests.forEach((x)=>{
    if (x==='')
      obj = obj;
    else
      obj = obj[x];
    if (obj===undefined || typeof(obj)==='number' && x==='length')
      res.status('404').send("Not Found");
  });
  console.log(typeof( obj ) == 'number', obj);
  switch(typeof( obj )){
    case 'object': res.send(obj);break;
    case 'string': res.send("\"" + obj +"\"");break;
    case 'number': res.send(obj.toString());break;
  }
}
const app = express();
app.use(cors());
app.use( function ( req, res, next ){
  console.log(req.url);
  next();
});
app.get('/result3a/volumes', (req, res) => {
  let obj = {};
  pc.hdd.forEach((x)=>{
    if (obj[x.volume] != undefined )
      obj[x.volume] = ( Number(obj[x.volume].slice(0,-1)) + x.size).toString() + 'B';
    else
      obj[x.volume] = x.size.toString()+'B';
  });
  res.json(obj);
});
app.get('/result3a/*', (req, res) => {
  toJSON( req.url.substring(9), res );
});
app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
