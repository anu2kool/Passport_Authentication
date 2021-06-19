const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');

router.get('/login',(request,response)=>{
	response.render('Login');
});

router.get('/register',(request,response)=>{
	response.render('Register');
})

router.post('/register', async (request,response)=>{

	const {name, email, password, cpassword} = request.body;
	
	let errors=[];

	if(!name || !email || !password || !cpassword){
		errors.push({"msg":"Please fill all the fields!!"});
	}
	if(password.length<8){
		errors.push({"msg":"Minimum password length is 8"});
	}
	if(password!==cpassword){
		errors.push({"msg":"Password and Confirm password must match"});
	}
	if(errors.length>0){
		response.render('register',{errors,name,email,password,cpassword});
	}

	const usercheck=await User.findOne({email:email});

	if(usercheck){
		errors.push({"msg":"Email already registered!!"});
		response.render('register',{errors,name,email,password,cpassword});
	}
	const user=new User({name,email,password});
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(user.password, salt, async function(err, hash) {
        	user.password=hash;
        	await user.save();
    	});
	});
	request.flash('success_msg',"You are registered successfully!!");
	response.redirect('/users/login');

});

router.post('/login',async (request,response,next)=>{
	passport.authenticate('local',{
		successRedirect:"/dashboard",
		failureRedirect:"/users/login",
		failureFlash:true
	})(request,response,next);
});

router.get('/logout',(request,response)=>{
	request.logout();
	request.flash('success_msg',"You are logged out");
	response.redirect('/users/login');
})

module.exports=router;