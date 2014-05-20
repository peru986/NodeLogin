var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var mongo       = require('mongodb');
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
                console.log("VideoBlob: "+ post.videoBlob);
                console.log("VideoBlobURL: "+ post.videoBlobURL);
                			    // append date stamp when record was created //
				post.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                post.tags = tagsSeparados;
                post.comments = [];

                //prueba 
                //var binaryData = new MongoDB.Binary(post.videoBlob);
                var binaryData = new mongo.Binary(post.videoBlob)
               
                //Prueba para ver si puedo detectar el campo vacio
                if (post.videoBlob===""){
                    console.log("video BLOB VACIO");

                    }
              
                //post.videoBlob = post.videoBlob;
				post.videoBlob= binaryData;
                post.videoBlobURL= post.videoBlobURL;

                
                posts.insert(post, {safe: true}, callback);
                console.log("POST INSERTADO ");
					
				}
			});
}
//metodo para añadir un nuevo comentario.
exports.newComment = function(commentData,callback){
    posts.findOne({title: commentData.title}, function(e, post){
        if (e) console.log('ERRORAZO  encontrando el post PM.newComment');
        var titlePost = commentData.title;
        var bodyComentario = commentData.commentBody;
        var authorComentario = commentData.author;
        var dateComentario = moment().format('MMMM Do YYYY, h:mm:ss a');
        var idPost = commentData.post_id;
        console.log('DATOS CAPTURADOS: '+ titlePost+" "+ bodyComentario+" "+ authorComentario+" "+ idPost+" ");

        posts.update({title: titlePost},
            {
               //$set: {comments: arrayComentarios}
               $push: {'comments': {'author':authorComentario,'body':bodyComentario,'date':dateComentario}}
            },callback)
            //function(e,updated){if (!e) console.log('Comentario insertado');}          
        });


        
}


exports.editPost = function(postData,callback){

        posts.findOne({title: postData.oldTitle}, function(e, post){

        if (e) console.log('ERRORAZO  encontrando el post PM.editPost');
        else{
            var oldTitle = postData.oldTitle;
            var titlePost = postData.title;
            var bodyPost = postData.body;
            var authorPost = postData.author;
            var dateEdit = moment().format('MMMM Do YYYY, h:mm:ss a');
            var idPost = post._id;
            var tags = postData.tags;
            var comments = post.comments;
            var videoBlob = post.videoBlob;
            var videoBlobURL= post.videoBlobURL;

            console.log('DATOS CAPTURADOS: '+ titlePost+ " "+ bodyPost+" "+ authorPost+" "+dateEdit+" "+tags+" [comments]  "+comments+" [videoBLOb] "+videoBlob+" [videoBLObURL]  "+videoBlobURL+" ");
            //var texto = post.comments + commentData.commentBody;
            //arrayComentarios.push(texto);

           // db.ejemplo.update( {‘autor’:'angel’, ‘titulo’:'Mi primer post…’}, {$push: {‘comentarios’: {‘autor’:'Perico’, ‘texto’:'Que bien’}}})
           //post.comments= arrayComentarios;


           //COMPROBAMOS SI EL TITUO ES EL MISMO, SI NO LO ES BORRAMOS EL ARTICULO E INSERTAMOS UNO NUEVO
           if (oldTitle === titlePost){


               // console.log("TITLOS IGUALES!!!!!!, el body: "+ bodyPost);      
                posts.update({title: titlePost},
                    {
                        title:titlePost,
                        body: bodyPost,
                        date: dateEdit,
                        author: authorPost,
                        tags: tags,
                        comments: comments,
                        videoBlob: videoBlob,
                        videoBlobURL: videoBlobURL

                        //$set: {comments: arrayComentarios}
             
                    },callback)

            }else{
            
                posts.remove({title:oldTitle},callback);
            
                posts.insert({
                    title: titlePost,
                    body: bodyPost,
                    date: dateEdit,
                    author: authorPost,
                    tags: tags,
                    comments: comments,
                    videoBlob: videoBlob,
                    videoBlobURL: videoBlobURL

                }, {safe: true}, callback);
            



            
            }
      }//end else

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

      
/* auxiliary methods */

var getObjectId = function(id)
{
	return posts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	posts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

      
   





	
  
    

