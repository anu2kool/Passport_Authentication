const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const User=require('../models/User');

module.exports=async function(passport){
	passport.use(
		new LocalStrategy({usernameField:'email'}, async (email,password,done)=>{
			const user= await User.findOne({email:email});
			if(!user){
				return done(null, false, {message:"Email is not registered!!"});
			}
			await bcrypt.compare(password,user.password,(error,isMatch)=>{
				if(error) throw error;
				if(isMatch){
					return done(null,user);
				}else{
					return done(null,false,{message:"Password incorrect!!"});
				}
			});
		})
	);
	passport.serializeUser(function(user, done) {
  	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
  	User.findById(id, function(err, user) {
    	done(err, user);
  	});
});
}