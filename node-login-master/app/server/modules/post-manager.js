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


exports.addNewPost = function(post, callback)
{
	posts.findOne({title:post.title}, function(e, o) {
		if (o){
			callback('There is a Post with that name: '+ post.title);
		}	else{
			    
                //separamos las tags
                var tags = post.tags;
                var tagsSeparados = tags.split(" ");
                console.log("TAGS SEPARADOS: "+ tagsSeparados);

			    // append date stamp when record was created //
				post.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                post.tags = tagsSeparados;
                post.comments = [];
				posts.insert(post, {safe: true}, callback);
                console.log("POST INSERTADO ");
					
				}
			});
}
//metodo sin probar para añadir un nuevo comentario.
//NO FUCA! ARREGLAR!
exports.newComment = function(commentData,callback){
    posts.findOne({_id: commentData._id}, function(e, post){
        var titlePost = commentData.title;
        var bodyComentario = commentData.commentBody;
        var authorComentario = commentData.author;
        var dateComentario = moment().format('MMMM Do YYYY, h:mm:ss a');
        var idPost = commentData.post_id;
        console.log('DATOS CAPTURADOS: '+ titlePost+" "+ bodyComentario+" "+ authorComentario+" "+ idPost+" ");
        //var texto = post.comments + commentData.commentBody;
        //arrayComentarios.push(texto);

       // db.ejemplo.update( {‘autor’:'angel’, ‘titulo’:'Mi primer post…’}, {$push: {‘comentarios’: {‘autor’:'Perico’, ‘texto’:'Que bien’}}})
       //post.comments= arrayComentarios;

        posts.update({title: titlePost},
            {
               //$set: {comments: arrayComentarios}
               $push: {'comments': {'author':authorComentario,'body':bodyComentario,'date':dateComentario}}
            },function(e,updated){if (!e) console.log('Comentario insertado');}          
        );

        //console.log('post title: '+ post.title);
        //console.log('post commentarios : '+ post.comments);
        //console.log('COMENTARIO a introducir: '+ commentData.commentBody);
       // console.log('COMENTARIO INTRODUCIDO: '+ arrayComentarios);


        });
        
}

//METODO PARA BUSCAR LOS ARTICULOS SEGUN AUTOR
//NO PROBADO
exports.getAllPostsFromAuthor = function(author,callback)
{
	posts.find({author:author}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

//METODO PARA BUSCAR LOS ARTICULOS SEGUN UN TAG
//NO PROBADO
exports.getAllPostsFromTag = function(tag,callback)
{
	posts.find({tags:tag}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


    

exports.getAllPosts = function(callback)
{
	posts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

//metodo sin probar para obtener un post segun su id
//PROBLEMA no encuentra los posts segun el id
exports.findPostById=function(id, callback){

    console.log("el id dentro del findpostbyid es: "+ id);
    posts.find({_id:id}, function(error, result) {
          if( error ){
              callback(error)
              }else{
                  if (result===null){
                      callback('ERROR: Post not found');
                      }else{ callback(null, result);}
                    }
            });

      };

exports.findPostByTitle=function(title, callback){
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

exports.findPostByAuthor=function(author, callback){
    posts.findOne({author: author}, function(error, result) {
          if( error ){
              callback(error)
              }else{
                  if (result===null){
                      callback('ERROR: Post not found');
                      }else{ callback(null, result);}
                    }
            });

      };

      
   





	
  
    

