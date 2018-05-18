var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
// res.send('Responda com recursos');
// });


/* GET lista de usuarios. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.usersQuery({
		limit:200,
		
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
//	        result.body.response.users.forEach(function(user) {
//	            console.log(user.first_name + ' ' + user.last_name)
//	        });
	        
	    	console.log("Lista de usuarios::: " + JSON.stringify(result.body.response.users));
	    	
	    	res.render('usuarios', 
	    			{ 
	    				title: 'Listagem de Usuários', 
	    				usuarios: result.body.response.users,
	    				nome_usuario_logado: req.user.first_name,
	    			});
	    }
	});
    
});

/* POST pesquisa na lista de usuarios. */
router.post('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.usersQuery({
		
		limit:200,
		where : { role: req.body.perfil_pesquisa}
	
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
//	        result.body.response.users.forEach(function(user) {
//	            console.log(user.first_name + ' ' + user.last_name)
//	        });
	        
	    	console.log("Lista de usuarios::: " + JSON.stringify(result.body.response.users));
	    	
	    	res.render('usuarios', 
	    			{ 
	    				title: 'Listagem de Usuários', 
	    				usuarios: result.body.response.users,
	    				nome_usuario_logado: req.user.first_name,
	    			});
	    }
	});
    
});

/* GET cadastra novo usuario. */
router.get('/novo-usuario', isLoggedIn, function(req, res, next) {
  res.render('novo-usuario', 
		  { 
	  		title: 'Adicionar novo Usuário',  
	  		action: '/novo-usuario',
	  		nome_usuario_logado: req.user.first_name
		  });
  
});

/* POST Adiciona novo usuário. */
router.post('/novo-usuario', isLoggedIn, function(req, res) {
  var email = req.body.email;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;
  var perfil = req.body.role;
  
  var ArrowDB = require('arrowdb'),
	  arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	
  arrowDBApp.usersCreate({
	  email: email,
	  username: email,
	  first_name: first_name,
	  last_name: last_name,
	  password: password,
	  password_confirmation: password_confirmation,
	  role: perfil
	}, function(err, result) {
	  if (err) {
	      console.error(err.message);
	      
	      res.status(500);
	      res.render('error', {error: err, message: err.message});
	      
	  } else {
	      console.log(result.body.response.users[0]);
	      
	      res.redirect('/usuarios');
	  }
	});

})

/* GET carrega usuario por ID. */
router.get('/editar-usuario/:id', isLoggedIn, function(req, res, next) {
  var id = req.params.id;
  
  
    var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.usersQuery({
		limit: 10,
	    where: {
	        id: id
	    }
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	        result.body.response.users.forEach(function(user) {
	            console.log(user.first_name + ' ' + user.last_name)
	        });
	        
	        console.log("Usuário encontrado ::: " + JSON.stringify(result.body.response.users[0]));
	        
	    	res.render('editar-usuario', 
	    			{ 
	    				title: 'Edição de Usuário', 
	    				user: result.body.response.users[0], 
	    				nome_usuario_logado: req.user.first_name,
	    				action: '/editar-usuario/' + result.body.response.users[0].id 
	    			});
	    }
	});
  
});

/* POST Editar Usuário. */
router.post('/editar-usuario/', isLoggedIn, function(req, res) {
  var id = req.body.id;
//  var email = req.body.email;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var role = req.body.role;
  
  var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

  arrowDBApp.usersUpdate({
	    su_id: id,
//	  	email: email,
	    first_name: first_name,
	    last_name: last_name,
	    role: role
	    
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	        console.log(result.body.response.users[0]);
	        res.redirect('/usuarios');
	    }
	});
  
});

/* GET Deletar Usuário. */
router.get('/deletar-usuario/:id', isLoggedIn, function(req, res) {
	var id = req.params.id;

	console.log("Peguei o session ID? " + req.user.sessionID);
	
	var ArrowDB = require('arrowdb'),
	    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.usersDelete({
		su_id: id
	},function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	        console.log('Usuário Excluído!');
	        res.redirect('/usuarios');
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
