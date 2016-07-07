'use strict';

var awsPreUrl = 'https://h6f11hxf0b.execute-api.us-east-1.amazonaws.com/prod?';
var awsQueryURL = 'query=';//'query=pizza' or whatever you want
var LatLngURL = '&ll=';//lat and lang
var limitURL = '&limit=1'; //limit is set to 1 result per API call
var radius = '&radius=50'; //calculated in meters
var awsAPI;
var latlng;
var queryString;
var venueObject = 0;
var resultObject = [];//will push results of getJson here then use for static map
//var btn1 ;//$( "#btn1" )
var queryObjLen;

var hrefURL = 'https://www.google.com/maps/dir//';
var baseURL = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&scale=2&maptype=roadmap/&markers=size:mid%7Ccolor:red%7C';
var endURL = '&zoom=17&style=feature:poi%7Cvisibility:off&key=AIzaSyDDkZ7_wwkrhwoBvZ-QkHToo-8J-KytCwI';
var googleMapURL;

var j = 0;

//object below holds a list of different food categories to insert into query=
var queryOpts = {
    '1': {
       '1': 'pizza',
       '2': 'chinesefood',
       '3': 'salads',
       '4': 'coffee',
       '5': 'mexican',
       '6': 'cuban',
       '7': 'indian',
       '8': 'thai',
       '9': 'burgers',
       '10': 'noodles'
       },
    '2': {'1': 'spa', '2': 'massage', '3': 'zen'},
    '3': {'1': 'movies', '2': 'broadway'}
};

var testtt = Object.keys(queryOpts['2']);
var foodObj = queryOpts["1"];


//hard coded food for now
var queryObjLen = Object.keys(queryOpts["1"]).length;

//Returns a random number between min (inclusive) and max (exclusive)
function getRandom(min, max) {
    //return Math.random() * (max - min) + min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//generates random number from 1-6. linked to queryOpts Object above
var RandomNum = getRandom(1,10);

//will turn on location services, which we need to get local Points of interest
function geolocate(callbackhere) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){

        var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

        latlng = geolocation.lat + ',' + geolocation.lng ;
        //console.log(latlng);
       callbackhere();

        });
     } else {
         alert("Please allow locations services.");
         location.reload();
      }
}

function setMapImage(obj){
  console.log(obj);

  var btn1 = $( "#btn1" );

// Now, we are going to bind data to the button.
// This data will include the array of jQuery
// elements that we want to show and the index of
// the currently selected item.
  btn1.data(
       "config",
       {
           Index: 0,
           Collection: $( obj )
       }
     );

  // Now that we have our data bound, let's bind
  // the click event.
  btn1.click(
     function( objEvent ){
         var jThis = $( this );
         // Get the config data out of the button.
         var objConfig = jThis.data( "config" );
         // Check to see if our index it out of
         // bounds (more items to click).
         if (objConfig.Index < objConfig.Collection.length){
            var venueResults = objConfig.Collection[ objConfig.Index++ ].response.venues[0];
            var venueName = venueResults.name;
            var st = venueResults.location.address;//street address
            var street = st.replace(/ /g, "+");//replace empty space with + for URL
            var csz = venueResults.location.formattedAddress[1]; //city state and zip
            var cityState = csz.replace(/ /g, "+");//replace empty space with + for URL
            var googleMapURL = baseURL+street+cityState+endURL;
            
            var currentMap = ".currentMap";
            j = j + 1;
            console.log('j',j);
             // Show the current item. When we are
             // doing this, post-increment the our
             // item index.
             //console.log( venueName );
             $('.load-spinner').show();
             
             
             $('#mapResult').append(
               ' <a class="currentMap'+[j]+'" target="_blank" href="'+hrefURL+street+cityState+'/"><img src="'+googleMapURL+'" alt="Google Map of '+st+csz+'"></a>' 
               + '<br>'
               + venueName + "<br>" //venue name
               + st + "<br>" //street adress
               + csz + "<br><br>" //city State zip code

             );
             $('.load-spinner').hide();
             setTimeout(function(){
                 $('html,body').animate({
              scrollTop: $(".bottom").offset().top},
              'slow');
             },200);
             
         }
         // Prevent default event (form submit).
         objEvent.preventDefault();
         return( false );
     }
   );
    
//       if (j = 10) {
////             $(btn1).hide();
//           console.log('j is', j);
//           }
    console.log('j sec',j);
}

geolocate(function(){

    var dataobj = 0;

    //id can be pizza, mexican, noodles, etc
    function getData(id) {
        var url = awsPreUrl + awsQueryURL + id + LatLngURL + latlng + limitURL;
        return $.getJSON(url);  // this returns a "promise"
    }

    for(var x in foodObj){
        resultObject.push(getData(foodObj[x]));
    }
//    console.log("result obj", resultObject);

    $.when.apply($, resultObject).done(function(){
        // This callback will be called with multiple arguments,
        // one for each resultObject call
        // Each argument is an array with the following structure: [data, statusText, jqXHR]
        // Let's map the arguments into an object, for ease of use
        var obj = [];

        for(var i = 0, len = arguments.length; i < len; i++){
            //[i][0] is set to retrieve the data only and ignore everything else
            obj.push(arguments[i][0]);
        }

        setMapImage(obj);//sending the entire obj array
    });

});
