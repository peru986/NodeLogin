
function HomeController()
{

// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

//MIO handle user logout //
	$('#btn-goNewPost').click(function(){ window.location.href = '/newPost'; });

//MIO handle addComment
 //   $('#btn-addComment').click(function(){$('#addComment').modal('show');});

//MIO handle user logout //
	$('#btn-goModifyAccount').click(function(){ window.location.href = '/modifyAccount'; });

//MIO search posts //
    $('#btn-search').click(function(){ window.location.href = '/searchPost'; });
// confirm account deletion //
	$('#account-form-btn1').click(function(){$('.modal-confirm').modal('show')});



// handle account deletion //
	$('add-comment-form-submit').click(function(){ window.location.href = '/modifyAccount'; });

    //toggle focus
    
   $('#addCommentsubmit').click(function(){$('#addComment, .window').hide();
                                            $('#global-nav').focus();});
   //window.location.href = '/modifyAccount';
   //$('#addCommentsubmit').click(function(){window.location.href = '/home';});

    $('#addComment').on('shown', function(){ $('#commentBody').focus(); });
	$('#addComment').on('hidden', function(){ $('#global-nav').focus(); });


    //that.addComment();




    $('#add-comment-form').ajaxForm({
		url: '/addComment',
		beforeSubmit : function(formData, jqForm, options){
		    
            console.log('ENTRA EN EL BEFORESUBMIT');
                
            formData.push($('#author').val());
            formData.push($('#commentBody').val());
            formData.push($('#title').val());
            formData.push($('#post_id').val());
            console.log('BODY en la funcion ajax: '+ $('#commentBody').val() );
            window.location.href = '/home'; 
                return true;
		},
		success	: function(data){
                console.log('ENTRA EN EL SUCcESS');
                //if (status == 'success') window.location.href = '/home';
                that.showLockedAlert('Your comment has been posted.<br>Redirecting you back to the homepage.');
			
		},
		error : function(){
                console.log('ENTRA EN EL error');
			console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});



/*
    $(document).on("click", ".open-Modal", function () {
        var myDNI = $(this).data('id');
        $(".modal-body #DNI").val( myDNI );
        });
*/
	
	//$('#addComment').on('shown', function(){});




/*
    this.addComment = function(){
        $('.modal-addcomment').modal('hide');
		var that = this;
		$.ajax({
			url: '/addComment',
			type: 'POST',
			data: { body: $('commentBody').val(),
                    title:'pruebacomentarios'
                    },
			success: function(data){
	 			that.showLockedAlert('Your comment has been Posted.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

*/
        


    this.goTo = function(path){
        var that = this;
		$.ajax({
			url: path,
			type: 'GET',
			data: { title: 'New Post',
                    udata : user,
                    accts : accounts},
			success: function(data){
	 			that.showLockedAlert('Redirecting to newPost.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
        
        
        }

	this.deleteAccount = function()
	{
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/delete',
			type: 'POST',
			data: { id: $('#userId').val()},
			success: function(data){
	 			that.showLockedAlert('Your account has been deleted.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}




	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/home",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}
}

HomeController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}


