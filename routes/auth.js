let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let worker = require('../models/auth');
let jwt = require('jsonwebtoken');

let cookieParser = require('cookie-parser')
const { body, validationResult } = require('express-validator');
let cors = require('cors');

const SECRET = 'Indi@!sL0$$P0k';
router.use(cors({credentials: true}));
router.use(cookieParser());
router.use(bodyParser.json());



/// creating user at



router.post('/singup', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
    body('number', 'Enter the valid number').isLength({ min: 10 }).isNumeric({}),
], async (req, res) => {
    console.log(req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await worker.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with this email already exists' })
        }
        user = await worker.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            number: req.body.number
        });
        res.json({ user });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 2: Authenticate a User using: POST '/api/auth/login'. No login required
router.post('/singin', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').isLength({ min: 1 }),
], async (req, res) => {
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email);
    try {
        let user = await worker.findOne({ email });
        
        const authtoken = jwt.sign({user}, SECRET);
        
        if (!user) {
            
            success = false;
            return res.status(400).json({ error: 'Please try to login with correct credentials' });
        }
        if (password === user.password) {
            success = true;
            
            // res.writeHead()
            // const token = `token=${authtoken};expires=${new Date(Date.now() + 1000*10)}`;
            
            // console.log(user, authtoken);
            // localStorage.setItem("token",authtoken);
            // .cookie("jwt",authtoken,{ maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true})
            // .setHeader('set-cookie',`jwt=${authtoken}; Max-Age=2592000; Path=/; HttpOnly`)
            res.json(authtoken);
            
        }
        else {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error);
    }
    
});



router.get('/about', async(req,res)=>{
    let token = req.cookies.jwt;
   
try {
    // let decode = jwt.decode(token);
    console.log(token);
   
    let varify = jwt.verify(token , SECRET);
    let data = varify.user ;
    let user = await worker.findOne({email:data.email});
   
     if(user){
        console.log(data);
         res.json(data);
        }else{
            res.json("error").status(400);
        }
        
            
        } catch (error) {
          res.json(error.message).status(400);
        }
    }
)






module.exports = router;