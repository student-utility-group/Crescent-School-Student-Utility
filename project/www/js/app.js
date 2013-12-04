function onDeviceReady() {
    $(document).ready(function(){
        // Attach the FastClick library to the .click event
        // FastClick.js
        // https://github.com/ftlabs/fastclick
        $(function () {
            FastClick.attach(document.body);
        });
        
        // iOS 7 status bars are translucent, we need to make our
        // own margin at the top of the screen to prevent overlap.
        if (parseFloat(window.device.version) === 7.0) {
            // The actual status bar is 20px, need to decide if
            // we want more white space
            document.body.style.marginTop = "20px";
        }    
        
        // Main login-page event handling for the login form submission
//        $('#login-button').click(function () {
//            $('.login-page').slideUp();
//            $('.main-page').slideDown();
//        });
        
            $('.main-page').hide();
        
        $(function () {
            FastClick.attach(document.body);
        });
        
        $('#login-button').click(function () {
            $('.login-page').slideUp();
            $('.main-page').slideDown();
        });
        
        $('.footer-build').click(function () {
            $('.main-page').slideUp();
            $('.login-page').slideDown();
        });
    
    });

    

} // End of onDeviceReady

document.addEventListener('deviceready', onDeviceReady, false);

    