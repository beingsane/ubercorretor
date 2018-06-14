var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();


/* GET lista de usuarios. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.usersQuery({
		limit:900,
		
	}, function(err, result) {
	    if (err) 
	    {
	        console.error(err.message);
		    
	        req.flash("error", err.message);
	    	res.render('usuarios', 
    			{ 
    				title: 'Listagem de Usuários', 
    				nome_usuario_logado: req.user.first_name,
    			});
	    } 
	    else 
	    {
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
	    if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", err.message);
	    	res.render('usuarios', 
    			{ 
    				title: 'Listagem de Usuários', 
    				nome_usuario_logado: req.user.first_name,
    			});
	    } 
	    else 
	    {
//	        result.body.response.users.forEach(function(user) {
//	            console.log(user.first_name + ' ' + user.last_name)
//	        });
	        
//	    	console.log("Lista de usuarios::: " + JSON.stringify(result.body.response.users));
	    	
	    	req.flash("success", "Pesquisa efetuada com sucesso.");
	    	
	    	res.render('usuarios', 
	    			{ 
	    				title: 'Listagem de Usuários', 
	    				usuarios: result.body.response.users,
	    				nome_usuario_logado: req.user.first_name
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
  
  req.assert('first_name', 'O nome é obrigatório').notEmpty();
  req.assert('last_name', 'O sobrenome é obrigatório').notEmpty();
  req.assert('email', 'O email é obrigatório').notEmpty();
  req.assert('email', 'Email inválido').isEmail();
  req.assert('password', 'A senha é obrigatória').notEmpty();
  req.assert('password', 'Digite ao menos 4 caracteres na senha.').isLength({min: 4});
  
  const erros = req.validationErrors();
  
  if(erros)
  {
	  erros.forEach(function(err) {
		  req.flash("error", err.msg);
      });
      
      res.render('novo-usuario', 
	  { 
		  title: 'Listagem de Usuários', 
		  nome_usuario_logado: req.user.first_name,
		  usuario: req.body, 
	  });
  }
  
  
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
		    
	      req.flash("error", "Este E-mail já foi utilizado por outro usuário. Por favor, escolha um novo email.");
	      res.render('novo-usuario', 
  		  { 
  			  title: 'Listagem de Usuários', 
  			  nome_usuario_logado: req.user.first_name,
  			  usuario: req.body, 
  		  });
      
	  } else {
	      console.log(result.body.response.users[0]);
	      
	      req.flash("success", "Usuário CADASTRADO com sucesso.");
	      
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
		if (err) 
	    {
	      	console.error(err.message);
		    
		    req.flash("error", "Usuário não encontrado.");
		    res.render('editar-usuario', 
	  		{ 
	  		  title: 'Listagem de Usuários', 
	  		  nome_usuario_logado: req.user.first_name
	  		});
	    } 
	    else 
	    {
	        result.body.response.users.forEach(function(user) {
	            console.log(user.first_name + ' ' + user.last_name)
	        });
	        
	        console.log("Usuário encontrado ::: " + JSON.stringify(result.body.response.users[0]));
	        
	    	res.render('editar-usuario', 
	    			{ 
	    				title: 'Edição de Usuário', 
	    				user: result.body.response.users[0], 
	    				nome_usuario_logado: req.user.first_name,
	    				action: '/editar-usuario/' + result.body.response.users[0].id,
	    		  		errors:{}
	    			});
	    }
	});
  
});

/* POST Editar Usuário. */
router.post('/editar-usuario/', isLoggedIn, function(req, res) {
  var id = req.body.id;

  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var role = req.body.role;
  
  var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

  arrowDBApp.usersUpdate({
	    su_id: id,
	    first_name: first_name,
	    last_name: last_name,
	    role: role
	    
	}, function(err, result) {
	    if (err) 
	    {
	        console.error(err.message);
		    
		    req.flash("error", "Houve um erro ao editar este usuário, por favor, tente novamente.");
		    res.render('editar-usuario', 
	  		{ 
	  		  title: 'Listagem de Usuários', 
	  		  nome_usuario_logado: req.user.first_name
	  		});
	    } 
	    else 
	    {
	        console.log(result.body.response.users[0]);
	        
	        req.flash("success", "Usuário EDITADO com sucesso!");
	        
	        res.redirect('/usuarios');
	    }
	});
  
});

/* GET Deletar Usuário. */
router.get('/deletar-usuario/:id', isLoggedIn, function(req, res) {
	var id = req.params.id;

	var ArrowDB = require('arrowdb'),
	    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.usersDelete({
		su_id: id
	},function(err, result) {
	    if (err) 
	    {
	        console.error(err.message);
		    
		    req.flash("error", err.message);
		    res.render('usuarios', 
	  		{ 
	  		  title: 'Listagem de Usuários', 
	  		  nome_usuario_logado: req.user.first_name
	  		});
	    } 
	    else 
	    {
	        console.log('Usuário Excluído!');
	        req.flash("success", "Usuário EXCLUÍDO com sucesso!");
	        
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
