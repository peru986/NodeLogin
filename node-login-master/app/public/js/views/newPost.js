$(document).ready(function(){

    
    
    var hc = new videoController();
    var npc = new newPostController();
    var pv = new PostValidator();


    $('#newPost-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return pv.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'title-taken'){
                
			    pv.showInvalidTitle();
			}
		}
	});
    
    
    // setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your Article has been created.</br>Click OK to return to the login page.');




    })

