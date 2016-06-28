
var geolocation = null;
var ref = new Firebase("https://carlos-sandbox.firebaseio.com");
var userlog = ref.child("userdata/logins");
var user = ref.child("userdata/users");

function geolocate(callb) {
    console.log('log1');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){

         geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

            lt = geolocation.lat;
            lg = geolocation.lng;
            console.log(lt);
            console.log(lg);
            console.log(geolocation);

//            usersRef.update({
//              "user1/lat": lt,
//              "user1/lng": lg,
//              "user1/LLobj": geolocation
//            });

            callb();

        });
     } else {
         alert("Please allow locations services.");
         location.reload();
      }
}

geolocate(function(){
    console.log('log2');
    var latandlang = lt + "," + lg;
    //console.log(latandlang);
    $("#mapimg").html('<img class="img-responsive" src="https://maps.googleapis.com/maps/api/staticmap?center='+latandlang+'&zoom=15&scale=2&size=400x200&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C'+latandlang+'" alt="Google Map of 40.7957402 ,-74.0005607">');


    ref.authAnonymously(function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
//        userlog.push({
//            "UID": authData.uid,
//            "Provider": authData.provider,
//
//        });
        var userUID = authData.uid;
        $("#firebaseUID").html(userUID);
        $("#latid").html(lt);
        $("#lngid").html(lg);

        user.update({
          [userUID]: {
              "Login-type": authData.provider,
              "Lat": lt,
              "Lng": lg,
              "LL": latandlang

          }
        });

      }
        console.log('fb func');
    }, {
      remember: "sessionOnly"
    });

});

