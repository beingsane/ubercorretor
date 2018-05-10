var express = require('express');
var router = express.Router();


/* GET lista de servicos. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		limit:200,
		classname: 'servico'
		
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
//	    	result.body.response.servico.forEach(function(serv) {
//	            console.log(serv);
//	            console.log("Nome serviço: " + serv.name);
//	            console.log("Categoria serviço: " + serv.name_categoria);
//	        });
	    	
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
//	    	    	result.body.response.categoria.forEach(function(cat) {
//	    	            console.log(cat);
//	    	        });
	    	    	
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
	
	var id_categoria = req.body.categoria_pesquisa;
	console.log("ID da Categoria no filtro: " + id_categoria )
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		
		limit:200,
		classname: 'servico',
		where : { "[CUSTOM_categoria]categoria_id": id_categoria}
	
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	        
//	    	result.body.response.servico.forEach(function(serv) {
//	            console.log(serv);
//	        });
	    	
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
//	    	    	result.body.response.categoria.forEach(function(cat) {
//	    	            console.log(cat);
//	    	        });
//	    	    	
//	    	    	console.log("Lista de categorias::: " + JSON.stringify(result.body.response.categoria));
	    	    	
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
router.post('/novo-servico', isLoggedIn, function(req, res) {
  
	var nome = req.body.name;
	var id_categoria = req.body.id_categoria;
	  
	var ArrowDB = require('arrowdb'),
		arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	  
	arrowDBApp.customObjectsQuery({
		limit:10,
		classname: 'categoria',
		where : {
			id: id_categoria
		},
		sel : {"all" : ["name"]}
		
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	    	console.log("Categoria - nome ::: " + JSON.stringify(result.body.response.categoria[0].name));
	    	
	    	var nome_categoria = result.body.response.categoria[0].name;
	    	
	    	arrowDBApp.customObjectsCreate({
	    		classname: 'servico',
	    	fields: {
	    	    name: nome,
	    	    id_categoria: id_categoria,
	    		name_categoria: nome_categoria,
	    	    "[CUSTOM_categoria]categoria_id": id_categoria,
	    	    su_id: req.user.id
	    	  }
	    	}, function(err, result) {
	    	
	    		if (err) {
	    			console.error(err.message);
	    	    } else {
	    	        console.log(result.body.response.servico);
	    	      
	    	        res.redirect('/servicos');
	    	  }
	    	});
	    }
	});
    
	

})

/* GET carrega serviço por ID. */
router.get('/editar-servico/:id', isLoggedIn, function(req, res, next) {
  var id = req.params.id;
  
  
    var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		limit: 5,
		classname: 'servico',
	    where: {
	    	id: id
	    }
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	        // TODO - Enviar mensagem de erro
	    } else {
	    	result.body.response.servico.forEach(function(serv) {
	            console.log(serv);
	        });
	    	
	        console.log("Serviço encontrado ::: " + JSON.stringify(result.body.response.servico[0]));
	        
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
    var nome = req.body.name;
  
    var ArrowDB = require('arrowdb'),
      arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
    arrowDBApp.sessionCookieString = req.user.sessionCookieString;

    arrowDBApp.customObjectsUpdate({
	    classname: 'servico',
	    id: id,
	    fields: {
	    	name: nome
	    }
	    
	}, function(err, result) {
	    if (err) {
	        console.error(err.message);
	    } else {
	    	result.body.response.servico.forEach(function(serv) {
	            console.log(serv);
	        });
	    	
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
