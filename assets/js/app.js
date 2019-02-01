  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCRUpNr7McISy4W9O5p2S_bPRcSbnpnXK8",
    authDomain: "train-scheduler-e0a73.firebaseapp.com",
    databaseURL: "https://train-scheduler-e0a73.firebaseio.com",
    projectId: "train-scheduler-e0a73",
    storageBucket: "train-scheduler-e0a73.appspot.com",
    messagingSenderId: "677339782478"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Create an on click function that adds trains to the top table
$("#submit-btn").on("click", function(event) {
  event.preventDefault();

  // create variables with the user input from form
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var trainStartTime = $("#trainStartTimeInput").val().trim();
  var frequency = $("#frequencyInput").val().trim();

  // create a temporary object for holding the new train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    trainStartTime: trainStartTime,
    frequency: frequency
  };

  // upload the new train data to the database
  database.ref().push(newTrain);

  // console log the values that were just pushed to the database
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.trainStartTime);
  console.log(newTrain.frequency);

  // clear the form values after values have been stored
  $("input").val("");

});

// create a firebase event for adding the data from the new trains and then populating them in the DOM.
database.ref().on("child_added", function(childSnapshot) {
 // log the values
  console.log("Train Name: " + childSnapshot.val().trainName);
  console.log("Destination: " + childSnapshot.val().destination);
  console.log("First Train Time: " + childSnapshot.val().trainStartTime);
  console.log("Frequency: " + childSnapshot.val().frequency);

// Set currentTime variable to current unix time  
let currentTime = moment().unix();

// Convert the train frequency to seconds 
let trainIntervalInSeconds = childSnapshot.val().frequency * 60;

// Convert the train start time 
let trainStartTime = moment(childSnapshot.val().trainStartTime, "HH:mm").unix();

// Subtract trainStartTime from currentTime
let timeDifference = currentTime - trainStartTime;

// Divide "timeDifference" by 'trainIntervalInSeconds', round up the result
let iterations = Math.ceil(timeDifference/trainIntervalInSeconds);

// Multiply 'trainIntervalInSeconds' by 'interations', add product to trainStartTime
let nextArrival = trainStartTime + (trainIntervalInSeconds * iterations);

// Subtract currentTime (unix in seconds) from nextArrival (unix in seconds), multiply by 60 to get to minutes
let minutesAway = Math.ceil((nextArrival - currentTime)/60);

 // Change format of nextArrival to 'hh:mm AM/PM'
nextArrival = moment.unix(nextArrival).format("LT");

$("#trainInfo").append(
  "<tr class='train'><td id='trainName'> " + childSnapshot.val().trainName +
  " </td><td id='destination'> " + childSnapshot.val().destination +
  " </td><td id='frequency'> " + childSnapshot.val().frequency +
  " </td><td id='nextArrival'> " + nextArrival +
  " </td><td id='minutesAway'> " + minutesAway + "</td></tr>");

// Handle the errors
}, function (errorObject) {
console.log("Errors handled: " + errorObject.code);

});
