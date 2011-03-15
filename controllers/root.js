module.exports = function(app,opts) {

app.get('/', function(req, res){


res.cookie('userDigits', 'how are you?', { maxAge: 900000 });


        if(!req.session){
                req.session.regenerate();
        }

        res.render('home.jade', opts);

});


}
