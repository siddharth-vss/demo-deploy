let express = require('express');
let bodyParser = require('body-parser');
let cookieparser =require('cookie-parser');
let path = require('path');
let app = express();
let cors = require('cors');


app.use(express.static(path.resolve(__dirname,"./public")) )
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors({credentials: true}));
app.use('/', require('./routes/auth'))


app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./public','index.html'));
})


app.listen(5000,()=>{
console.log(`Server is running on port http://localhost:5000`);
});