$(document).ready(function(){
        // Attach the FastClick library to the .click event
        // FastClick.js
        // https://github.com/ftlabs/fastclick
        $(function () {
            FastClick.attach(document.body);
        });

         
        
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