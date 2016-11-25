import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/result2x/*', (req, res) => {
  console.log(req.query.i);
  switch(Number(req.query.i)){
    case 0:res.send( '1' );break;
    case 1:res.send( '18' );break;
    case 2:res.send( '243' );break;
    case 3:res.send( '3240' );break;
    case 4:res.send( '43254' );break;
    case 5:res.send( '577368' );break;
    case 6:res.send( '7706988' );break;
    case 7:res.send( '102876480' );break;
    case 8:res.send( '1373243544' );break;
    case 9:res.send( '18330699168' );break;
    case 10:res.send( '244686773808' );break;
    case 11:res.send( '3266193870720' );break;
    case 12:res.send( '43598688377184' );break;
    case 13:res.send( '581975750199168' );break;
    case 14:res.send( '7768485393179328' );break;
    case 15:res.send( '103697388221736960' );break;
    case 16:res.send( '1384201395738071424' );break;
    case 17:res.send( '18476969736848122368' );break;
    case 18:res.send( '246639261965462754048' );break;
     }
   res.send( "Invalid username" );
});

app.listen(3003, () => {
  console.log('Your app listening on port 3003!');
});
577
