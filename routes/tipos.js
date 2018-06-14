var express = require('express');
var router = express.Router();


/* GET lista de tipo. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		limit:200,
		classname: 'tipo'
		
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", err.message);
	    	res.render('tipos', 
    			{ 
    				title: 'Listagem de Tipos', 
    				nome_usuario_logado: req.user.first_name,
    			});	    
	    } 
		else 
		{
	    	var types = result.body.response.tipo;
	    	
	    	arrowDBApp.customObjectsQuery({
	    		limit:10,
	    		classname: 'categoria'
	    		
	    	}, function(err, result) {
	    		if (err) 
	    	    {
	    	    	console.error(err.message);
	    		    
	    	        req.flash("error", "Erro ao carregar as Categorias.");
	    	    	res.render('tipos', 
	        			{ 
	        				title: 'Listagem de Tipos', 
	        				nome_usuario_logado: req.user.first_name,
	        				tipos: types,
	        			});
	    	    } 
	    	    else 
	    	    {
//	    	    	result.body.response.categoria.forEach(function(cat) {
//	    	            console.log(cat);
//	    	        });
	    	    	
	    	    	console.log("Lista de categorias::: " + JSON.stringify(result.body.response.categoria));
	    	    	
	    	    	res.render('tipos', 
	    	    			{ 
	    	    				title: 'Lista de Tipos', 
	    	    				tipos: types,
	    	    				categorias: result.body.response.categoria,
	    	    				nome_usuario_logado: req.user.first_name,
	    	    			});
	    	    }
	    	});
	        
	    }
	});
    
});

/* POST pesquisa na lista de tipos. */
router.post('/', isLoggedIn, function(req, res, next) {
	
	var id_categoria = req.body.categoria_pesquisa;
	console.log("ID da Categoria no filtro: " + id_categoria )
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		
		limit:200,
		classname: 'tipo',
		where : { "[CUSTOM_categoria]categoria_id": id_categoria}
	
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", err.message);
	    	res.render('tipos', 
    			{ 
    				title: 'Listagem de Tipos', 
    				nome_usuario_logado: req.user.first_name,
    			});
	    } 
	    else 
	    {
//	    	result.body.response.servico.forEach(function(serv) {
//	            console.log(serv);
//	        });
	    	
	    	console.log("Lista de tipos::: " + JSON.stringify(result.body.response.tipo));
	    	
	    	var types = result.body.response.tipo;
	    	
	    	arrowDBApp.customObjectsQuery({
	    		limit:10,
	    		classname: 'categoria'
	    		
	    	}, function(err, result) {
	    		if (err) 
	    	    {
	    	    	console.error(err.message);
	    		    
	    	        req.flash("error", "Erro ao carregar as Categorias.");
	    	    	res.render('tipos', 
	        			{ 
	        				title: 'Listagem de Tipos', 
	        				nome_usuario_logado: req.user.first_name,
	        				tipos: types,
	        			});
	    	    } 
	    	    else 
	    	    {
	    	    	req.flash("success", "Pesquisa efetuada com sucesso.");
	    	    	
	    	    	res.render('tipos', 
	    	    			{ 
	    	    				title: 'Lista de Tipos', 
	    	    				tipos: types,
	    	    				categorias: result.body.response.categoria,
	    	    				nome_usuario_logado: req.user.first_name,
	    	    			});
	    	    }
	    	});
	        
	    }
	});
    
});

/* GET cadastrar novo tipo. */
router.get('/novo-tipo', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
		arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.customObjectsQuery({
		limit:10,
		classname: 'categoria'
		
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", "Erro ao carregar as Categorias.");
	    	res.render('novo-tipo', 
    			{ 
    				title: 'Adicionar novo Tipo', 
    				nome_usuario_logado: req.user.first_name
    			});
	    } 
	    else 
	    {
	    	console.log("Lista de categorias::: " + JSON.stringify(result.body.response.categoria));
	    	
	    	res.render('novo-tipo', 
	    			  { 
	    		  		title: 'Adicionar novo Tipo',  
	    		  		action: '/novo-tipo',
	    		  		categorias: result.body.response.categoria,
	    		  		nome_usuario_logado: req.user.first_name
	    			  });
	    }
	});
	
    
  
});

/* POST Adiciona novo tipo. */
router.post('/novo-tipo', isLoggedIn, function(req, res) {
  
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
		if (err) 
	    {
	    	console.error(err.message);
		    
		    req.flash("error", "Erro ao carregar as Categorias.");
		    res.render('novo-tipo', 
	  		{ 
	  			title: 'Adicionar novo Tipo', 
	  			nome_usuario_logado: req.user.first_name,
	  			tip: req.body, 
	  		});
	    } 
	    else 
	    {
	    	var nome_categoria = result.body.response.categoria[0].name;
	    	
	    	arrowDBApp.customObjectsCreate({
	    		classname: 'tipo',
	    	fields: {
	    	    name: nome,
	    	    id_categoria: id_categoria,
	    		name_categoria: nome_categoria,
	    	    "[CUSTOM_categoria]categoria_id": id_categoria,
	    	    su_id: req.user.id
	    	  }
	    	}, function(err, result) {
	    	
	    		if (err) 
	    		{
	    			console.error(err.message);
	    		    
	    		    req.flash("error", err.message);
	    		    res.render('novo-tipo', 
	    	  		{ 
	    	  			title: 'Adicionar novo Tipo', 
	    	  			nome_usuario_logado: req.user.first_name,
	    	  			tip: req.body, 
	    	  		});
	    	    } 
	    		else 
	    		{
	    	        console.log(result.body.response.servico);
	    	        
	    	        req.flash("success", "Tipo CADASTRADO com sucesso.");

	    	        res.redirect('/tipos');
	    	  }
	    	});
	    }
	});
    
	

})

/* GET carrega tipo por ID. */
router.get('/editar-tipo/:id', isLoggedIn, function(req, res, next) {
  var id = req.params.id;
  
  
    var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.customObjectsQuery({
		limit: 5,
		classname: 'tipo',
	    where: {
	    	id: id
	    }
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
		    req.flash("error", "Tipo não encontrado.");
		    res.render('editar-tipo', 
	  		{ 
	  		  title: 'Edição de Tipo', 
	  		  nome_usuario_logado: req.user.first_name
	  		});
	    } 
	    else 
	    {
	    	result.body.response.tipo.forEach(function(serv) {
	            console.log(serv);
	        });
	    	
	        console.log("Tipo encontrado ::: " + JSON.stringify(result.body.response.tipo[0]));
	        
	        if (result.body.response.tipo[0])
        	{
        	
	        	res.render('editar-tipo', 
	    			{ 
	    				title: 'Edição de Tipo', 
	    				tipo: result.body.response.tipo[0], 
	    				nome_usuario_logado: req.user.first_name,
	    				action: '/editar-tipo/' + result.body.response.tipo[0].id 
	    			});
        	}
	        else
        	{
	        	console.error(err.message);
			    
			    req.flash("error", "Tipo não encontrado.");
			    res.render('editar-tipo', 
		  		{ 
		  		  title: 'Edição de Tipo', 
		  		  nome_usuario_logado: req.user.first_name
		  		});
        	}
	    }
	});
  
});

/* POST Editar Tipo. */
router.post('/editar-tipo/', isLoggedIn, function(req, res) {
    var id = req.body.id;
    var nome = req.body.name;
  
    var ArrowDB = require('arrowdb'),
      arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
    arrowDBApp.sessionCookieString = req.user.sessionCookieString;

    arrowDBApp.customObjectsUpdate({
	    classname: 'tipo',
	    id: id,
	    fields: {
	    	name: nome
	    }
	    
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
		    req.flash("error", "Houve um erro ao editar este Tipo, por favor, tente novamente.");
		    res.render('editar-tipo', 
	  		{ 
	  		  title: 'Edição de Tipo', 
	  		  nome_usuario_logado: req.user.first_name
	  		});
	    } 
	    else 
	    {
	    	result.body.response.tipo.forEach(function(tip) {
	            console.log(tip);
	        });
	    	
	        req.flash("success", "Tipo EDITADO com sucesso!");
	    	res.redirect('/tipos');
	    }
	});
  
});

/* GET Deletar Tipo. */
router.get('/deletar-tipo/:id', isLoggedIn, function(req, res) {
	var id = req.params.id;

	var ArrowDB = require('arrowdb'),
	    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.customObjectsDelete({
		classname: 'tipo',
	    id: id
	},function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
		    req.flash("error", err.message);
		    res.redirect('/tipos');
	    } 
	    else 
	    {
	        console.log('Tipo Excluído!');
	        
	        req.flash("success", "Tipo EXCLUÍDO com sucesso!");
	        res.redirect('/tipos');
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
