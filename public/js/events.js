$(document).ready(function() {
    $("#register").on("click", function(event) {
        event.preventDefault();
        var user = {
            firstName: $("#materialRegisterFormFirstName").val().trim(),
            lastName: $("#materialRegisterFormLastName").val().trim(),
            email: $("#materialRegisterFormEmail").val().trim(),
            password: $("#materialRegisterFormPassword").val().trim(),
            phoneNumber: $("#materialRegisterFormPhone").val().trim(),
            subscribed: $("#materialRegisterFormNewsletter").val().trim(),
        };
        $.ajax("/register", {
            type: "POST",
            data: user
        }).then(
            $.ajax("/signin", {
                type: "POST",
                data: user
            }).then(
                console.log("User registered and signed in")
            )
        ) 
    })
});