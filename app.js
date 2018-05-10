var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var servicosRouter = require('./routes/servicos');
var atendimentosRouter = require('./routes/atendimentos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, 'public')));

//required for passport
app.use(session({ secret: 'silvinhoximenes' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/servicos', servicosRouter);
app.use('/atendimentos', atendimentosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.serializeUser(function(user, done) {
	
	done(null, user);
});

passport.deserializeUser(function(usuario_logado, done) {
//	console.log("ID que chega no deserializeUser: " + id );
	
	done(null, usuario_logado);
});
	
passport.use(new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'email',
	    passwordField : 'senha',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
  function(req, email, senha, done) {
	  
		var ArrowDB = require('arrowdb'),
		    arrowDBApp = new ArrowDB('Rzt1Yat1xlvAa3hETbihRuAHmoT4aGLL', {
		    	 	autoSessionManagement: false
		    	 });
		
		arrowDBApp.usersLogin({
		    login: email,
		    password: senha
		}, function(err, result) {
		    if (err) {
		        console.error("Login error:" + (err.message || result.reason));
                
		        return done(null, false, req.flash('signupMessage', 'E-mail ou Senha incorretos.'));

//		        return done(null, false, { message: 'E-mail ou Senha incorretos.' });

//		        res.send('A autenticação falhou!');
		        //TODO - Enviar mensagem de erro para o index/home
		    } else {
		    	console.log("Usuário encontrado!");
		       
		        arrowDBApp.sessionCookieString = result.cookieString;
		        console.log("Cookie String ::: " + result.cookieString);
		        
		        var usuario_logado = result.body.response.users[0];
		        
		        if (usuario_logado.role !== 'admin')
	        	{
			        return done(null, false, req.flash('signupMessage', 'Usuário não tem permissão para acessar o sistema.'));
	        	}
		        
		        usuario_logado.sessionCookieString = result.cookieString;
		        usuario_logado.sessionID = result.body.meta.session_id;
		        console.log("Usuario logado com session ID ::: " + JSON.stringify(usuario_logado));
		        
		        return done(null, usuario_logado);
		    }
		});
	  
  }
));


module.exports = app;
