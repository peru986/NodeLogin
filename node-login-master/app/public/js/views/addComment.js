$(document).ready(function(){

    	$('#add-comment-form').ajaxForm({
		url: '/addComment',
		beforeSubmit : function(formData, jqForm, options){
		    console.log('ENTRA EN EL BEFORESUBMIT');
                formData.push($('#commentBody').val());
                console.log('BODY en la funcion ajax: '+ $('#commentBody').val() );
		},
		success	: function(responseText, status, xhr, $form){
			ev.showEmailSuccess("Check your email on how to reset your password.");
		},
		error : function(){
			ev.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
	$('#addComment').modal('show');
	$('#addComment').on('shown', function(){})

});