module.exports = function(app,opts) {

app.get('/logout', function(req,res){

if(req.cookies.userdigits){

       res.clearCookie('userDigits');
       res.clearCookie('hello');
       res.clearCookie('userName');
       res.clearCookie('phoneNumber');
       res.clearCookie('email');

}

        req.session.destroy(function(err){
                res.redirect('/');
        });


});



}
