function onDeviceReady() {
    if (parseFloat(window.device.version) === 7.0) {
          document.body.style.marginTop = "20px";
    }
	$('#login-button').click(function(){
		$username = "hi there";
		var store = new Lawnchair(function(){
			this.save({'username': username});
			this.get('username', function(u){alert(u);
		});
	});
});

} // End of onDeviceReady

document.addEventListener('deviceready', onDeviceReady, false);