var express = require('express');
var router = express.Router();

/* GET lista de atendimentos. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var ArrowDB = require('arrowdb'),
    	arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;

	arrowDBApp.eventsQuery({
		limit:800,
		
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", err.message);
	    	res.render('atendimentos', 
    			{ 
    				title: 'Listagem de Atendimentos', 
    				nome_usuario_logado: req.user.first_name,
    			});	    
	    } 
		else 
		{
//	    	result.body.response.events.forEach(function(evt) {
//	            console.log("Profissional Direto = " + evt.name_profissional);
//	            console.log("Profissional Custom Fields = " + evt.custom_fields.name_profissional);
//	        });
	        
	    	console.log("Lista de atendimentos::: " + JSON.stringify(result.body.response.events));
	    	
	    	var todos_atendimentos = result.body.response.events;
	    	
	    	arrowDBApp.customObjectsQuery({
	    		limit:100,
	    		classname: 'servico'
	    		
	    	}, function(err, result) {
	    		if (err) 
	    	    {
	    	    	console.error(err.message);
	    		    
	    	        req.flash("error", "Erro ao carregar os Serviços.");
	    	    	res.render('atendimentos', 
	        			{ 
	        				title: 'Listagem de Atendimentos', 
	        				nome_usuario_logado: req.user.first_name,
		    				atendimentos: todos_atendimentos,
	        			});
	    	    } 
	    	    else 
	    	    {
	    	    	console.log("Lista de serviços no Atendimento ::: " + JSON.stringify(result.body.response.servico));
	    	    	
	    	    	var todos_servicos = result.body.response.servico;
	    	    	
	    	    	arrowDBApp.customObjectsQuery({
	    	    		limit:100,
	    	    		classname: 'tipo'
	    	    		
	    	    	}, function(err, result) {
	    	    		if (err) 
	    	    	    {
	    	    	    	console.error(err.message);
	    	    		    
	    	    	        req.flash("error", "Erro ao carregar os Tipos.");
	    	    	    	res.render('atendimentos', 
	    	        			{ 
	    	        				title: 'Listagem de Atendimentos', 
	    	        				nome_usuario_logado: req.user.first_name,
    			    				servicos: todos_servicos,
    			    				atendimentos: todos_atendimentos,
	    	        			});
	    	    	    } 
	    	    	    else 
	    	    	    {
	    	    	    	console.log("Lista de tipos no Atendimento ::: " + JSON.stringify(result.body.response.tipo));
	    	    	    	
	    	    	    	var todos_tipos = result.body.response.tipo;
	    	    	    	
	    	    	    	req.flash("success", "Pesquisa efetuada com sucesso.");

	    	    	    	res.render('atendimentos', 
	    	    	    			{ 
	    			    	    		title: 'Listagem de Atendimentos', 
	    			    				atendimentos: todos_atendimentos,
	    			    				servicos: todos_servicos,
	    			    				tipos: todos_tipos,
	    	    	    				nome_usuario_logado: req.user.first_name,
	    	    	    			});
	    	    	    }
	    	    	});
	    	    	
	    	    }
	    	});
	    	
	    }
	});
    
});

/* POST pesquisa na lista de usuarios. */
router.post('/', isLoggedIn, function(req, res, next) {
	
	var nome_servico = req.body.servico_pesquisa;
	var nome_tipo = req.body.tipo_pesquisa;
	
	var ArrowDB = require('arrowdb'),
		arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL');
	arrowDBApp.sessionCookieString = req.user.sessionCookieString;
	
	arrowDBApp.eventsQuery({
		limit:800,
		where : {
			name_servico: nome_servico,
			name_tipo: nome_tipo
		}
	
	}, function(err, result) {
		if (err) 
	    {
	    	console.error(err.message);
		    
	        req.flash("error", "Ocorreu um erro ao carregar os Atendimentos.");
	    	res.render('atendimentos', 
    			{ 
    				title: 'Listagem de Atendimentos', 
    				nome_usuario_logado: req.user.first_name,
    			});	    
	    } 
		else 
		{
//	    	result.body.response.events.forEach(function(evt) {
//	            console.log(evt);
//	        });
	        
	    	console.log("Lista de atendimentos::: " + JSON.stringify(result.body.response.events));
	    	
	    	var todos_atendimentos = result.body.response.events;
	    	
	    	arrowDBApp.customObjectsQuery({
	    		limit:100,
	    		classname: 'servico'
	    		
	    	}, function(err, result) {
	    		if (err) 
	    	    {
	    	    	console.error(err.message);
	    		    
	    	        req.flash("error", "Erro ao carregar os Serviços.");
	    	    	res.render('atendimentos', 
	        			{ 
	        				title: 'Listagem de Atendimentos', 
	        				nome_usuario_logado: req.user.first_name,
		    				atendimentos: todos_atendimentos,
	        			});
	    	    } 
	    	    else 
	    	    {
	    	    	console.log("Lista de serviços no Atendimento ::: " + JSON.stringify(result.body.response.servico));
	    	    	
	    	    	var todos_servicos = result.body.response.servico;
	    	    	
	    	    	arrowDBApp.customObjectsQuery({
	    	    		limit:100,
	    	    		classname: 'tipo'
	    	    		
	    	    	}, function(err, result) {
	    	    		if (err) 
	    	    	    {
	    	    	    	console.error(err.message);
	    	    		    
	    	    	        req.flash("error", "Erro ao carregar os Tipos.");
	    	    	    	res.render('atendimentos', 
	    	        			{ 
	    	        				title: 'Listagem de Atendimentos', 
	    	        				nome_usuario_logado: req.user.first_name,
    			    				servicos: todos_servicos,
    			    				atendimentos: todos_atendimentos,
	    	        			});
	    	    	    } 
	    	    	    else 
	    	    	    {
	    	    	    	console.log("Lista de tipos no Atendimento ::: " + JSON.stringify(result.body.response.tipo));
	    	    	    	
	    	    	    	var todos_tipos = result.body.response.tipo;
	    	    	    	
	    	    	    	req.flash("success", "Pesquisa efetuada com sucesso.");

	    	    	    	res.render('atendimentos', 
	    	    	    			{ 
	    			    	    		title: 'Listagem de Atendimentos', 
	    			    				atendimentos: todos_atendimentos,
	    			    				servicos: todos_servicos,
	    			    				tipos: todos_tipos,
	    	    	    				nome_usuario_logado: req.user.first_name,
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
