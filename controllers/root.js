module.exports = function(app,opts) {

app.get('/', function(req, res){


//res.cookie('userDigits', 'how are you?', { maxAge: 900000 });


        if(!req.session){
                req.session.regenerate();
        }
	
	//console.log(req.cookies);

	if( req.cookies.userdigits == '511') {
		res.render('root.loggedin.jade');
	} else if (req.cookies.userdigits == '0' ){
		// some how display a message that says "please allow us to transcribe your messages for the application to work"
	}else {
        	res.render('home.jade', opts);
	}


});


}
