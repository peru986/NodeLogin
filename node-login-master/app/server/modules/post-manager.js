var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'node-login';

/* establish the database connection */

    db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log('FALLO CON LA BD (hace falta inicializarla): '+ e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

var PM= this;
var posts = db.collection('posts');


exports.addNewPost = function(newData, callback)
{
	posts.findOne({title:newData.title}, function(e, o) {
		if (o){
			callback('There is a Post with that name'+ newData.title);
		}	else{
			
			    // append date stamp when record was created //
				newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                newData.comments = [];
				posts.insert(newData, {safe: true}, callback);
                console.log("POST INSERTADO");
					
				}
			});
}
//metodo sin probar para añadir un nuevo comentario.
//NO FUCA! ARREGLAR!
exports.newComment = function(commentData,callback){
    posts.findOne({title: 'a'}, function(e, post){
        
        var arrayComentarios = [];
        var texto = post.comments + commentData.commentBody;
        arrayComentarios.push(texto);
        post.comments= arrayComentarios;

        


        posts.update({title: 'a'},
            {
               $set: {comments: arrayComentarios}
            },function(e,updated){if (!e) console.log('Comentario insertado');}          
        );

        console.log('post title: '+ post.title);
        console.log('post commentarios : '+ post.comments);
        console.log('COMENTARIO a introducir: '+ commentData.commentBody);
        console.log('COMENTARIO INTRODUCIDO: '+ arrayComentarios);


        });
        
}
    

exports.getAllPosts = function(callback)
{
	posts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

//metodo sin probar para obtener un post segun su id
//PROBLEMA CASCA CUANDO NO EXISTE EL OBJETO ENCUESTADO
exports.findPostById=function(title, callback){
    posts.findOne({title: title}, function(error, result) {
          if( error ){
              callback(error)
              }else{
                  if (result===null){
                      callback('ERROR: Post not found');
                      }else{ callback(null, result);}
                    }
            });

      };
      
   





	
  
    

