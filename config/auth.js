module.exports={
	ensureAuthenticated: (request,response,next)=>{
		if(request.isAuthenticated()){
			return next();
		}
		request.flash('error_msg','Please log in to view that source!!');
		response.redirect('/users/login');
	}
};