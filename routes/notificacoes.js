var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();


/* GET lista de notificacoes. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	//TODO - Pesquisar channels
	
//	arrowDBApp.usersQuery({
//		limit:900,
//		
//	}, function(err, result) {
//	    if (err) 
//	    {
//	        console.error(err.message);
//		    
//	        req.flash("error", err.message);
//	    	res.render('usuarios', 
//    			{ 
//    				title: 'Listagem de Usuários', 
//    				nome_usuario_logado: req.user.first_name,
//    			});
//	    } 
//	    else 
//	    {
//	    	console.log("Lista de usuarios::: " + JSON.stringify(result.body.response.users));
//	    	
//	    	  res.render('notificacoes', 
//	    			  { 
//	    		  		title: 'Nova Notificação',  
//	    		  		action: '/notificacoes',
//	    		  		nome_usuario_logado: req.user.first_name
//	    			  });
//	    }
//	});
    
	  res.render('notificacoes', 
			  { 
		  		title: 'Nova Notificação',  
		  		action: '/notificacoes',
		  		nome_usuario_logado: req.user.first_name
			  });

});



/* POST Envia nova notificacoes. */
router.post('/', isLoggedIn, function(req, res) {
  
  var titulo = req.body.titulo;
  var mensagem = req.body.mensagem;
  var canal = req.body.canal;
    
  req.assert('titulo', 'O título é obrigatório').notEmpty();
  req.assert('mensagem', 'A mensagem é obrigatória').notEmpty();
  req.assert('canal', 'O canal é obrigatório').notEmpty();
  
  const erros = req.validationErrors();
  
  if(erros)
  {
	  erros.forEach(function(err) {
		  req.flash("error", err.msg);
      });
      
      res.render('notificacoes', 
	  { 
		  title: 'Enviar Notificação', 
		  nome_usuario_logado: req.user.first_name,
		  notifica: req.body, 
	  });
  }
  
  
  console.log("Campos recebidos, vou enviar a notificação! ");
  
  
  var ArrowDB = require('arrowdb'),
// chave dev 		arrowDBApp = new ArrowDB('2k3TkMgKGgaSM2zj6YiUwZ1LDMETsqYx');
  		arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL'); 
  arrowDBApp.sessionCookieString = req.user.sessionCookieString;

  arrowDBApp.pushNotificationsNotify({
	    channel: canal,
	    to_ids: 'everyone',
	    payload: {
	    	"alert": mensagem,
//	        "badge": "+1",
	        "category": "sampleCategory", 
	        "icon": "little_star",
	        "sound": "door_bell",
	        "title": titulo,
	        "vibrate": true,
	        "custom_field_notificacao_admin":true,
	        "custom_field_alert": mensagem,
	        "custom_field_title": titulo
	    }
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	        console.log('Notificação enviada!');
	        
	      req.flash("success", "Notificação Enviada!");
	      
	      res.redirect('/notificacoes');
	    }
	});
  

})



//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
