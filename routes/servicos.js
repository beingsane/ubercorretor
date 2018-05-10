var express = require('express');
var router = express.Router();


/* GET lista de servicos. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		limit:200,
		classname: 'servico',
		response_json_depth: 3
		
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	    	result.body.response.servico.forEach(function(serv) {
	            console.log(serv);
	            console.log("Nome serviço: " + serv.name);
	            console.log("Categoria serviço: " + serv.categoria_servico);
	        });
	    	
	    	console.log("Lista de servicos::: " + JSON.stringify(result.body.response.servico));
	    	
	    	var services = result.body.response.servico;
	    	
	    	arrowDBApp.customObjectsQuery({
	    		limit:10,
	    		classname: 'categoria'
	    		
	    	}, function(err, result) {
	    	    if (err) {
	    	        console.error(err.message);
	    	        // TODO - Enviar mensagem de erro
	    	    } else {
	    	    	result.body.response.categoria.forEach(function(cat) {
	    	            console.log(cat);
	    	        });
	    	    	
	    	    	console.log("Lista de categorias::: " + JSON.stringify(result.body.response.categoria));
	    	    	
	    	    	res.render('servicos', 
	    	    			{ 
	    	    				title: 'Lista de Serviços', 
	    	    				servicos: services,
	    	    				categorias: result.body.response.categoria,
	    	    				nome_usuario_logado: req.user.first_name,
	    	    			});
	    	    }
	    	});
	        
	    }
	});
    
});

/* POST pesquisa na lista de servicos. */
router.post('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		
		limit:200,
		classname: 'servico',
//		where : { role: req.body.perfil_pesquisa}
	
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	        
	    	console.log("Lista de Servicos ::: " + JSON.stringify(result.body.response.servico));
	    	
	    	res.render('servicos', 
	    			{ 
	    				title: 'Listag de Serviços', 
	    				servicos: result.body.response.servico,
	    				nome_usuario_logado: req.user.first_name,
	    			});
	    }
	});
    
});

/* GET cadastra novo serviço. */
router.get('/novo-servico', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
		arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.customObjectsQuery({
		limit:10,
		classname: 'categoria'
		
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	    	console.log("Lista de categorias::: " + JSON.stringify(result.body.response.categoria));
	    	
	    	res.render('novo-servico', 
	    			  { 
	    		  		title: 'Adicionar novo Serviço',  
	    		  		action: '/novo-servico',
	    		  		categorias: result.body.response.categoria,
	    		  		nome_usuario_logado: req.user.first_name
	    			  });
	    }
	});
	
    
  
});

/* POST Adiciona novo serviço. */
router.post('/novo-serviço', isLoggedIn, function(req, res) {
  
  var nome = req.body.name;
  var id_categoria = req.body.id_categoria;
  
  var ArrowDB = require('arrowdb'),
	  arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
  arrowDBApp.sessionCookieString = req.user.sessionCookieString;
  
  arrowDBApp.customObjectsCreate({
	  classname: 'servico',
	    fields: {
	        name: nome,
	        categoria_id: id_categoria
	    }
	}, function(err, result) {
	  if (err) {
	      console.error(err.message);
	  } else {
	      console.log(result.body.response.servico);
	      
	      res.redirect('/servicos');
	  }
	});

})

/* GET carrega serviço por ID. */
router.get('/editar-servico/:id', isLoggedIn, function(req, res, next) {
  var id = req.params.id;
  
  
    var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.placesQuery({
		limit: 5,
	    where: {
	    	place_id: id
	    }
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	    	result.body.response.places.forEach(function(place) {
	            console.log(place);
	        });
	    	
	        console.log("Serviço encontrado ::: " + JSON.stringify(result.body.response.places[0]));
	        
	    	res.render('editar-servico', 
	    			{ 
	    				title: 'Edição de Serviço', 
	    				servico: result.body.response.servico[0], 
	    				nome_usuario_logado: req.user.first_name,
	    				action: '/editar-servico/' + result.body.response.servico[0].id 
	    			});
	    }
	});
  
});

/* POST Editar Serviço. */
router.post('/editar-servico/', isLoggedIn, function(req, res) {
  var id = req.body.id;

  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var role = req.body.role;
  
  var ArrowDB = require('arrowdb'),
    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
  arrowDBApp.sessionCookieString = req.user.sessionCookieString;

  arrowDBApp.placesUpdate({
	    place_id: id,


	    
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	    	console.log(result.body.response.places[0]);	        
	    	res.redirect('/servicos');
	    }
	});
  
});

/* GET Deletar Serviço. */
router.get('/deletar-servico/:id', isLoggedIn, function(req, res) {
	var id = req.params.id;

	var ArrowDB = require('arrowdb'),
	    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.customObjectsDelete({
		classname: 'servico',
	    id: id
	},function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	        console.log('Serviço Excluído!');
	        res.redirect('/servicos');
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
