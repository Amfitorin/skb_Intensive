import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/result2c', (req, res) => {
  if (req.query.fullname === "")
    res.send( "Invalid fullname" );
  let result = req.query.fullname.replace(/\s+/g,' ').trim().split(' ');
  for(var index in result)
  {
    if (result[index].search('[0-9_\/]')!= -1 )
      res.send( "Invalid fullname" );
    result[index] =  result[index][0].toUpperCase() + result[index].slice(1).toLowerCase();
  }
  
  if ( result.length == 3 )
  {
    const name = result[0][0];
    const sourName = result[2];
    const fatherName = result[1][0];
    res.send( `${sourName} ${name}. ${fatherName}.` );
  }
  else if (result.length == 2 )
  {
    const name = result[0][0];
    const sourName = result[1];
    res.send( `${sourName} ${name}.` );
  }
  else if (result.length == 1 )
  {
    const sourName = result[0];
    res.send( `${sourName}` );
  }
  else
    res.send( "Invalid fullname" );
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
