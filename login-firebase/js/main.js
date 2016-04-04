var ref = new Firebase("https://authsandbox.firebaseio.com");
// we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean
var isNewUser = true;

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}

// Register the callback to be fired every time auth state changes
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
  }
});


// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'google':
       return authData.google.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}

//user login  
$( "#login" ).click(function() {
    
  ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
          
          $("#info").html("Hi " + authData.google.displayName + "!")
          
          
      }
    }, {
      remember: "sessionOnly",
      scope: "email"
    });

    $("#login").hide();
    $("#logout").show();
    
    
});

//logs user out
$("#logout").click(function(){
    
    ref.unauth();
    console.log("User is logged out");
    location.reload();

});
