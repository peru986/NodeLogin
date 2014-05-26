
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var PM = require('./modules/post-manager');
//var LV = require('./modules/post-manager');

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
        PM.findPostByTitle(req.params.title, function(error, post){
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

        if (req.param('isPrivateVideo') == 'on')
            esVideoPrivado=1;
        else 
            esVideoPrivado=0;

		PM.addNewPost({
			title 	: req.param('postTitle'),
			body 	: req.param('postBody'),
			date 	: req.param('date'),
			author	: req.param('author'),
            tags    : req.param('postTags'),
            videoBlob : req.param('videoBlob'),
            videoBlobURL: req.param('videoBlobURL'),
            isPrivate: esVideoPrivado
  
                            
  //author	: req.session.user ESTO PASA EL OBJETO USUARIO
  
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


     app.get('/editPost/:idPost', function(req,res){

            var id= req.params.idPost;
            //console.log("el titulo del post es: "+ req.params.idPost);

            PM.findPostById(id, function(error, post){
            
            if (error){console.log("ERROR EN EL GET ");res.send(error,400)}
            else{
                //console.log("renderizando la pagina enviando el post, con id: "+ post._id);
                
               
                res.render('editPost',{
                    post: post,
                    udata: req.session.user
                
                });
             }
            
            });
            });

      app.post('/editPost/:idPost', function(req, res){

		console.log("ESTE SON LOS PARAMETROS PASADOS DESDE EL editPost/post :"
                + " TITLE:"+ req.body.editTitle
                + " COMMENTBODY: "+ req.body.editBody
                + " author: "+ req.body.author
                + " tags: "+ req.body.editTags
                ); 
            
        if (req.param('isPrivateVideo') == 'on')
            esVideoPrivado=1;
        else 
            esVideoPrivado=0;

        //var data = req.body;  
          
        PM.editPost({
            oldTitle: req.param('oldTitle'),
            title 	: req.param('editTitle'),
			body 	: req.param('editBody'),
			//date 	: req.param('date'),
			author	: req.param('author'),
            tags    : req.param('editTags'),
            videoBlob : req.param('videoBlob'),
            videoBlobURL: req.param('videoBlobURL'),
            isPrivate: esVideoPrivado

        },function(e){
            if (e){

                res.send(e, 400);
            }else{
                console.log('ROUTER.JS(post de editPOST RES.SEND OK)');
                res.send('ok',200);
                }
            });    
            
     });    



    //METODO SIN USAR MODAL PARA AÑADIR COMENTARIO
    //PONE ID_POST PERO EN REALIDAD SE ESTA EMPLEANDO EL TITULO XQ NO FUCA LA FINDBYID
   
     app.get('/addComment/:idPost', function(req,res){

            var id= req.params.idPost;
            //console.log("el titulo obtenido de la url es: "+ req.params.idPost);

            PM.findPostById(id,function(error, post){
                
                
                if (error){
                    console.log("ERROR EN EL GET ");res.send(error,400)}
                
                else{
               // console.log("renderizando la pagina enviando el post, con id: "+ post.title);
               // console.log("renderizando la pagina enviando el post, con usuario: "+ req.session.user.name);
                
               
                res.render('addComment',{
                    post: post,
                    udata: req.session.user
                
                });
                             
            }
                
                })
            
    });


           

  app.post('/addComment/:idPost', function(req, res){

		console.log("ESTE SON LOS PARAMETROS PASADOS DESDE EL addComment/post :"
                + "TITLE:"+ req.body.title 
                + " COMMENTBODY: "+ req.body.commentBody 
                + "author: "+ req.body.author 
                + " id: "+ req.body._id); 
            

        var data = req.body;  
          
        PM.newComment({
            title: req.body.title,
            commentBody: req.body.commentBody,
            author: req.body.author,
            post_id: req.body._id

        },function(e){
            if (e){

                res.send(e, 400);
            }else{
                console.log('ROUTER.JS(post de addCOmment RES.SEND OK)');
                res.send('ok',200);
                }
            });    
            
     });             
     


    //BUSCAR POSTS
    app.get('/searchPost', function(req,res){
        if (req.session.user == null){
            res.redirect('/');
	    }else{
		    res.render('searchPost', {                   
                    udata : req.session.user
                    });
	    }
        });

    app.post('/searchPost', function(req, res){
		//console.log("[searchpost] authorSearch:"+ req.body.authorSearch + " tagSearch: "+ req.body.tagSearch + "checkbox1: " + req.param('isAuthorSearch') );    
        
            var isAuthorSearch = req.param('isAuthorSearch') == 'on';
            var isTagSearch = req.param('isTagSearch') == 'on';
            var isTitleSearch = req.param('isTitleSearch') == 'on';
            
        if (req.param('searchField')== ''){
		    console.log("ERROR EN EL GET ");res.send("Campo de busqueda vacio",400);           
            }

        else if ((isAuthorSearch)&(isTagSearch)&(isTitleSearch)){





            
                }else if (isAuthorSearch){

                    PM.findPostByAuthor(req.body.searchField, function(error, post){
            
                        if (error){
                            
                            console.log("Post no encontrado ");res.send(error,400)

                            }else{

                            console.log("renderizando la pagina enviando el post, con titulo: "+ post.title);
                            res.render('addComment',{
                                post: post,
                                udata: req.session.user
                
                            });
                        }
            
                    });


                        
                      
                }else if (isTagSearch){

                    PM.getAllPostsFromTag(req.body.searchField, function(error, posts){
            
                        if (error){
                            
                            console.log("Post no encontrado ");res.send(error,400)

                            }else{

                            console.log("devuelta coleccion de posts: ");
                            res.render('printPosts',{
                                posts: posts,
                                udata: req.session.user
                
                            });
                        }
            
                    });

                }


	    });





    //AÑADIDO POR MI, HE CAMBIADO LA PAGINA HOME POR MODIFYACCOUNT
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

            PM.getAllNoPrivatePosts(req.session.user.name,function (e, postCollection){
                if (!e)
                    res.render('home',{
                        title : 'Welcome HOME',
                        countries : CT,
                        udata : req.session.user,
                        posts : postCollection  
                        })
                
                });

        }
	});
	
    /*
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
	*/


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