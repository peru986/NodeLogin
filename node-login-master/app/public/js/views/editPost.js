$(document).ready(function(){

    var ep = new editPostController();

        $('#editPost-form').ajaxForm({
		    
		    beforeSubmit : function(formData, jqForm, options){
		        //console.log('BEFORESUBMIT_formData: '+ formData.commentBody);
                    //formData.push($('#commentBody').val());
                console.log('BODY en la funcion ajax: '+ $('#editBody').val() );
                return true;//prueba
		    },
		    success	: function(responseText, status, xhr, $form){
                //console.log('SUCCESS EN FORM AJAX, variable status: '+ status);
			    //console.log('mostrando modal');
                $('.modal-alert').modal('show');
                   // ev.showEmailSuccess("Check your email on how to reset your password.");
		    },
		    error : function(e){
                console.log('ERROR EN EL FORMULARIO DE EDIT POST');
			    //ev.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
    
   // setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your Post has been modified.</br>Click OK to return to the login page.');

 
    
    
    
    
    })