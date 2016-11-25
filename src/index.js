import express from 'express';
import cors from 'cors';
var numer = require('big-number');

const app = express();
const calculate = function( index ){
   if (index == 0)
          return 1;
      if (index == 1)
          return 6 * 3 * calculate(0);
      if (index == 2)
          return 6 * 2 * calculate(1) + 9 * 3 * calculate(0);
      return numer(calculate(index - 1)).multiply(12).add(numer(calculate(index - 2)).multiply(18));
}
app.use(cors());
const env = 3/(Math.pow(3/2,1/2) - 1);
app.get('/result2x/*', (req, res) => {
  res.send( calculate(req.query.i).toString()) );
});

app.listen(3003, () => {
  console.log('Your app listening on port 3003!');
});
577
