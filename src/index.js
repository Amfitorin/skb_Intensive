import express from 'express';
import cors from 'cors';
import 'isomorphic-fetch';


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

let pc = {};
//noinspection JSUnresolvedFunction
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
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
    else if (Number(x)||Number(x)===0) {
      if (Number(x) === 0)
        res.status('404').send("Not Found");
      obj = obj[Number(x) - 1];
    }
    else {
      let res = x.split('?');
      let result = [];
      if (res.length === 1 )
          obj = obj[x];
      else {
        let key = res[0];
        Array(String(res[1]).split('&')).forEach((z)=> {
          res = String(z).split('=');
          obj[key].forEach((y)=> {
            console.log(y[res[0]]);
            let keys = String(res[0]).split('_');
            if (keys.length > 1) {
              if (keys[1] === 'lt' && y[keys[0]] && y[keys[0]] < ( Number(res[1]) || res[1] ))
                result.push(y);
              else if (keys[1] === 'gt' && y[keys[0]] && y[keys[0]] > ( Number(res[1]) || res[1] ))
                result.push(y);
            }
            else if (y[res[0]] && y[res[0]] === ( Number(res[1]) || res[1] ))
              result.push(y);
          });
          obj = result;
        });
      }

    }
    if (obj===undefined || typeof(obj)==='number' && x==='length')
      res.status('404').send("Not Found");
  });
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
app.get('/result3b/volumes', (req, res) => {
  let obj = {};
  pc.hdd.forEach((x)=>{
    if (obj[x.volume] != undefined )
      obj[x.volume] = ( Number(obj[x.volume].slice(0,-1)) + x.size).toString() + 'B';
    else
      obj[x.volume] = x.size.toString()+'B';
  });
  res.json(obj);
});
app.get('/result3b/*', (req, res) => {
  toJSON( req.url.substring(9), res );
});
app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
