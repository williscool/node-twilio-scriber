module.exports = function(app,opts) {

app.get('/logout', function(req,res){

if(req.cookies.userdigits){

       res.clearCookie('userDigits');
        res.clearCookie('hello');

}

        req.session.destroy(function(err){
                res.redirect('/');
        });


});



}
