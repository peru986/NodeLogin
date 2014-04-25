
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var PM = require('./modules/post-manager');

module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});
	

    app.get('/post/:title', function(req,res){
        PM.findPostById(req.params.title, function(error, post){
            console.log("el titulo obtenido de la url es: "+ req.params.title);
            if (error){res.send(error,400)}
            else{
                console.log("renderizando la pagina enviando el post, con titulo: "+ post.title);
            res.render('post_show',{
                post: post
                
                });
            }
            
            });
        });



    //PRUEBA PA ADDPOST
    app.get('/newPost', function(req, res) {
        if (req.session.user == null){
            res.redirect('/');
	    }else{

		    res.render('newPost', {  
                    title: 'New Post',
                    udata : req.session.user
                    });
	    }
        });
	
	app.post('/newPost', function(req, res){
		PM.addNewPost({
			title 	: req.param('postTitle'),
			body 	: req.param('postBody'),
			date 	: req.param('date'),
			author	: req.session.user.name
			//country : req.param('country')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{

                PM.getAllPosts( function(e, postCollection){
			    res.render('home', {udata:req.session.user, posts : postCollection });
		});
                
				
			}
		});
	});

    //A�ADIR COMENTARIO

    app.post('/addComment', function(req, res){
		console.log("ESTE SON LOS PARAMETROS PASADOS DESDE EL MODAL: TITLE:"+ req.body.title + " COMMENTBODY: "+ req.body.commentBody);    
        PM.newComment({
                    title: req.body.title,
                    commentBody: req.body.body}, function(e, obj){
			    if (!e){
				    res.redirect('/');
	                }	else{
				    res.send('post not found', 400);
			    }
	        });
	    });



    //A�ADIDO POR MI, HE CAMBIADO LA PAGINA HOME POR MODIFYACCOUNT
    app.get('/modifyAccount', function(req, res) {
	        if (req.session.user == null){
	    // if user is not logged-in redirect back to login page //
	            res.redirect('/');
	        }   else{
			    res.render('modifyAccount', {
				    title : 'Control Panel',
				    countries : CT,
				    udata : req.session.user
			    });
	        }
	    });

	app.post('/modifyAccount', function(req, res){
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});



// logged-in user homepage //
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{

            PM.getAllPosts(function (e, postCollection){
                if (!e)
                    res.render('home',{
                        title : 'Welcome HOME',
                        countries : CT,
                        udata : req.session.user,
                        posts : postCollection  
                        })
                
                });




          /*  
            AM.getAllRecords(function (e, accounts){ 
			    if (!e)
                res.render('home', {
				    title : 'Welcome HOME',
				    countries : CT,
				    udata : req.session.user,
                    accts : accounts                                                

			});
                                
	    });
        */

        }
	});
	
    
	app.post('/home', function(req, res){
        //este post ahora habria que cambiarlo para enviar un POST al server con un nuevo "articulo o video"

		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};