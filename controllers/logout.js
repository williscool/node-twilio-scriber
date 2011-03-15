module.exports = function(app,opts) {

app.get('/logout', function(req,res){

        res.clearCookie('userDigits');
        res.clearCookie('hello');

        req.session.destroy(function(err){
                res.redirect('/');
        });


});



}
