
function HomeController()
{

// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

//MIO handle user logout //
	$('#btn-goNewPost').click(function(){ window.location.href = '/newPost'; });

//MIO handle addComment
    $('#btn-addComment').click(function(){$('.modal-addcomment').modal('show')});

//MIO handle user logout //
	$('#btn-goModifyAccount').click(function(){ window.location.href = '/modifyAccount'; });

// confirm account deletion //
	$('#account-form-btn1').click(function(){$('.modal-confirm').modal('show')});



// handle account deletion //
	$('.modal-addcomment .submit').click(function(){ that.addComment(); });



    this.addComment = function(){
        $('.modal-addcomment').modal('hide');
		var that = this;
		$.ajax({
			url: '/addComment',
			type: 'POST',
			data: { body: $('#commentBody').text,
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


