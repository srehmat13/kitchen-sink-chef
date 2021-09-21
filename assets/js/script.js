var sKEY = 'dbefcc9a25f8481a9786d8ffcf0b2c2e';
var eKEY = 'f4d6c76fe323190b120931cc39642aad';
var eID = 'c8eab63d';
var recipeContent = $("#recipe-content");

// display recipe on screen 
// missing instructions
var getRecipeByIngredients = function(title, image, main, other) {
  // clear html for recipe content 
  recipeContent.html("");
  // create elememts
  var recipeTitle = $("<h3>").text(title);
  var recipeImg = $("<img>").attr('src', image);
  var divMain = $("<div>").addClass('main-ingredients').append(
    $("<h5>").text('Main Ingredients'),
    $("<ul>").addClass('collection')
  );
  var divOther = $("<div>").addClass('other-ingredients').append(
    $("<h5>").text('Other Ingredients'),
    $("<ul>").addClass('collection')
  );
  // loop to pupolate main and other Ingredients
  for (var i=0;i<main.length;i++) {
    divMain.children('.collection').append($("<li>").addClass("collection-item").text(main[i].original));
  }
  for (var i=0;i<other.length;i++) {
    divOther.children('.collection').append($("<li>").addClass("collection-item").text(other[i].original));
  }
  // append elements
  recipeContent.append(recipeTitle, recipeImg, divMain, divOther);

};

var getRecipeByCuisineType = function(food) {
  // clear html for recipe content 
  recipeContent.html("");
  console.log(food);
  var recipeTitle = $("<h3>").text(food.label);
  var recipeImg = $("<img>").attr('src', food.image);
  var divIngredients = $("<div>").addClass('main-ingredients').append(
    $("<h5>").text('Ingredients'),
    $("<ul>").addClass('collection')
  );
  // loop to pupolate ingredients
  for (var i=0;i<food.ingredientLines.length;i++) {
    divIngredients.children('.collection').append($("<li>").addClass("collection-item").text(food.ingredientLines[i]));
  }
  recipeContent.append(recipeTitle, recipeImg, divIngredients);
};

$('#search-button').on('click', function() {
    // gets user ingredients from search bar 
    // and splits it into an array
    // initialized finished variable 
    var userInput = $(this).siblings().val();
    var userIngredients = userInput.split(' ');
    var finished = '';

    // concats finished variable
    for (var i=0; i<userIngredients.length; i++) {
        finished +=  `+${userIngredients[i]},`  
    }

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${finished}&number=100&apiKey=${sKEY}`).then(function(response){
        return response.json();
    }).then(function(data) {
      // get random number to get random element in data array 
      var randomNum = Math.floor(Math.random() * data.length);
      var food = data[randomNum];

      // main data 
      var id = food.id;
      var title = food.title;
      var image = food.image;
      var mainIngredients = food.usedIngredients;
      var otherIngredients = food.missedIngredients;
  
      // ask TA 
      // instructions
      // fetch(`https://api.spoonacular.com/recipes/?id=${id}/analyzedInstructions&apiKey=${sKEY}`).then(function(response) {
      //   return response.text();
      // }).then(function(data) {
      //   console.log(data);
      // });
      
      // display on screen
      getRecipeByIngredients(title, image, mainIngredients, otherIngredients);

    })
});

$("#search-cuisine").on('click', function () {
  var type = $("#cuisine").val();
  
  fetch(`https://api.edamam.com/api/recipes/v2?type=public&random=true&cuisineType=${type}&app_id=${eID}&app_key=${eKEY}`).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    var randomNum = Math.floor(Math.random() * data.hits.length);
    var food = data.hits[randomNum].recipe;
    getRecipeByCuisineType(food);
  });
});
