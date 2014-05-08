function navBarController()
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

//MIO handle go home //
$('#btn-goHome').click(function(){ window.location.href = '/home'; });

//MIO search posts //
$('#btn-search').click(function(){ window.location.href = '/searchPost'; });

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