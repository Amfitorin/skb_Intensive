import express from 'express';
import cors from 'cors';
import 'isomorphic-fetch';


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

let pc = fetch(pcUrl);
//noinspection JSUnresolvedFunction
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

const Filter = function(obj,resu){
    let result = [];
   let count = 0;
          Array(String(resu[1]).split('&'))[0].forEach((z)=> {
            obj = count === 0 ? obj : result;

            result = [];
            resu = String(z).split('=');
            if ( resu[0] ==='havePet'){
              let temp = pc.pets;
              let test = {}
              temp.forEach((pet)=>{
                if (pet.type === resu[1] && ! test[pet.userId])
                  test[pet.userId] = true;
              });
              obj.forEach((user)=>{
                if ( test[user.id] )
                  result.push( user );
              });
            }
            else
              obj.forEach((y)=> {
                let keys = String(resu[0]).split('_');
                if (keys.length > 1) {
                  if (keys[1] === 'lt' && y[keys[0]] && y[keys[0]] < ( Number(resu[1]) || resu[1] ))
                    result.push(y);
                  else if (keys[1] === 'gt' && y[keys[0]] && y[keys[0]] > ( Number(resu[1]) || resu[1] ))
                    result.push(y);
                }
                else if (y[resu[0]] && y[resu[0]] === ( Number(resu[1]) || resu[1] ))
                  result.push(y);
              });
              obj = result;
            });
            return obj;
}


const toJSON = function ( param, res ){
  if ( param === '/length' )
    res.send(pc.length.toString());
  pc.users.forEach((user)=>{
    user.pets = undefined;
  });
  pc.pets.forEach((pet)=>{
      pet.user = undefined;
    });

  var obj = pc;
  let byName = false
  let last;
  const requests = param.split('/');
  requests.forEach((x)=>{
    last = !last ? x:last;
    if (x==='')
      obj = obj;
    else if (Number(x)||Number(x)===0) {
      if (Number(x) === 0)
        res.status('404').send("Not Found");
      obj = obj[Number(x) - 1];
    }
    else if (x.startsWith('populate')) {
      let result = [];
      let query = x.split('?');
      let test = pc;
      if (query.length != 1)
        obj = Filter(obj, query)
      if (last ==='pets'){
        if ( !Array.isArray(obj) )
         {
            let temp = obj;
            temp.user = test.users[obj.userId - 1];
            obj = temp;
         }
        else{
          let temp = obj;
          temp.forEach((pet)=>{
            pet.user = test.users[pet.userId - 1];
          });
          obj = temp;
          }
          }
      else{
          if( !Array.isArray(obj) )
            {
              let pets = [];
              let temp = obj;
              test.pets.forEach((pet)=>{
                if (pet.userId == obj.id)
                  pets.push(pet);
              });
              temp.pets = pets;
              obj = temp;
            }
          else{
            let temp = obj;
            temp.forEach((user)=>{
              let pets = [];
              test.pets.forEach((pet)=>{
                if (pet.userId == user.id)
                  pets.push(pet);
              });
              user.pets = pets;
            });
            obj = temp;
          }
        }
     }
    else {
      let resu = x.split('?');
      let result = [];
      if (resu.length === 1 )
        if (obj[x] && !Number(x)){
          obj = obj[x];
          }
        else{
          obj.forEach((curr)=>{
            if (curr.username === x || curr.id === x )
              result.push(curr);
          });
          obj = result[0];
        }
      else {
        obj = Filter(obj[resu[0]],resu);

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
