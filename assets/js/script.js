var sKEY = 'dbefcc9a25f8481a9786d8ffcf0b2c2e';
var eKEY = 'f4d6c76fe323190b120931cc39642aad';
var eID = 'c8eab63d';
var recipeContent = $("#recipe-content");

// display recipe on screen 
var getRecipeByIngredients = function(title, image, main, other, instructions) {
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
  var divRecipe = $("<div>").addClass('instructions').append(
    $("<h5>").text('Instructions'),
    $("<ul>").addClass('collection')
  );
  // loop to pupolate main and other Ingredients
  for (var i=0;i<main.length;i++) {
    divMain.children('.collection').append(
      $("<li>").addClass("collection-item").text(main[i].original)
    );
  }
  for (var i=0;i<other.length;i++) {
    divOther.children('.collection').append(
      $("<li>").addClass("collection-item").text(other[i].original)
    );
  }
  for (var i=0;i<instructions.length;i++) { 
    divRecipe.children('.collection').append(
      $("<li>").addClass("collection-item").text(instructions[i])
    );
  }
  // append elements
  recipeContent.append(recipeTitle, recipeImg, divMain, divOther, divRecipe);

};

var getRecipeByCuisineType = function(food) {
  // clear html for recipe content 
  recipeContent.html("");
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

$("#showIngredients").on('click', function() {
  $(".search-ingredients").removeClass("hide");
  $(".search-cuisine").addClass("hide");
});
$("#showCuisineType").on('click', function() {
  $(".search-cuisine").removeClass("hide");
  $(".search-ingredients").addClass("hide");
});

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
      var instructions = [];
    
      // fetch call for instructions
      fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${sKEY}`).then(function(response) {
        return response.json();
      }).then(function(data) {
        var steps = data[0].steps;
        for (var i=0;i<steps.length;i++) {
          instructions.push(steps[i].step);
        }
        // display on screen
        getRecipeByIngredients(title, image, mainIngredients, otherIngredients, instructions);
      });
    }).catch(function(error) {
      recipeContent.html(`<h4>Recipe not Found</h4>
                          <p>Please make sure you enter your ingredients correctly!<p>`);
    })
});

$("#search-cuisine").on('click', function () {
  var type = $("#cuisine").val();
  
  fetch(`https://api.edamam.com/api/recipes/v2?type=public&random=true&cuisineType=${type}&app_id=${eID}&app_key=${eKEY}`).then(function(response) {
    return response.json();
  }).then(function(data) {
    var randomNum = Math.floor(Math.random() * data.hits.length);
    var food = data.hits[randomNum].recipe;
    getRecipeByCuisineType(food);
  }).catch(function(error) {
    recipeContent.html(`<h4>Recipe not Found</h4>
                        <p>Please make sure you enter your ingredients correctly!<p>`);
  });
});


