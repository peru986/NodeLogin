
function editPostController(){

// redirect to homepage when cancel button is clicked //
	$('#btn-cancel').click(function(){ window.location.href = '/';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
	$('.modal-alert #ok').click(function(){
        console.log('MUESTRO MODAL');
         setTimeout(function(){
         window.location.href = '/home';
        }, 300)});
    }