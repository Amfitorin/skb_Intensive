import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/result2c', (req, res) => {
  if (req.query.username === "")
    res.send( "Invalid username" );
  let name = req.query.username.match(/(^(?:\w+:)?(?:\/\/)?(?:[\w-_%]+\.[\w-_%]+)+\/)?\W?([\w\.]+)\/?/)[2];
  if (name)
    res.send( "@"+name );
  else
    res.send( "Invalid username" );
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
