const express=require("express");
const mongoose=require('mongoose');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const flash=require("connect-flash");
const session=require("express-session");
const passport=require('passport');

require('./config/passport')(passport);

const db=require('./config/keys').MongoURI;

mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
	console.log('mongo db connected!!')
}).catch((err)=>{
	console.log(err)
});

app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((request, response, next)=>{
	response.locals.success_msg=request.flash('success_msg');
	response.locals.error_msg=request.flash('error_msg');
	response.locals.error=request.flash('error');
	next();
});

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
	console.log("Hello World!!");
});