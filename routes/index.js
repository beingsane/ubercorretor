var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Uber Corretor de Imóveis', message: req.flash('loginMessage') });
});

/* POST Efetuando o Login */
router.post('/',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

/* GET Efetuando o Logout */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


/* GET dashboard page. */
router.get('/dashboard', isLoggedIn,  function(req, res, next) {

	var ArrowDB = require('arrowdb'),
	    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	
	//Busca os 5 últimos usuários cadastrados
	arrowDBApp.usersQuery({
	    limit:5
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {

	    	var usuarios_recentes = result.body.response.users;
	    	
	    	//Busca a quantidade total de usuários
	    	arrowDBApp.usersCount(function(err, result) {
	    	    if (err) {
	    	        console.error(err.message);
	    	    } else {
	    	        
	    	    	var total_usuarios = result.body.meta.count;
	    	    	
	    	    	arrowDBApp.eventsCount(function(err, result) {
	    	    	    if (err) {
	    	    	        console.error(err.message);
	    	    	    } else {
	    	    	        
	    	    	        res.render('dashboard', 
	    	        			{ 
	    	        				title: 'Dashboard - Uber Corretor de Imóveis',
	    	        				nome_usuario_logado: req.user.first_name,
	    	        				quantidade_usuarios : total_usuarios,
	    	        				quantidade_atendimentos : result.body.meta.count,
	    	        				usuarios: usuarios_recentes
	    	        			});
	    	    	    }
	    	    	});
	    	    	
	    	    }
	    	});
	    }
	});
	
});

//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;