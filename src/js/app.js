$(document).ready(function(){
	$('#login-button').click(function(){
		$username = "hi there";
		var store = new Lawnchair(function(){
			this.save({'username': username});
			this.get('username', function(u){alert(u);});
		});
	});
});