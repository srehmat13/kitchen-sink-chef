var sKEY = 'dbefcc9a25f8481a9786d8ffcf0b2c2e';
var eKEY = 'f4d6c76fe323190b120931cc39642aad';
var eID = 'c8eab63d';
var recipeContent = $("#recipe-content");
var recentSection = $("#recents");
var recents = [];

var saveToLS = function (array) {
  localStorage.setItem('recent-recipes', JSON.stringify(array));
};

// display to favorites
var pushToRecents = function(title) {
  console.log(recents, title);
  recents.push(title);
  console.log(recents);
  saveToLS(recents);
}

var loadRecents = function() {
  recents = JSON.parse(localStorage.getItem('recent-recipes'));
  if (!recents) {
    recents = [];
  }
  for (var i=0;i<recents.length;i++) {
    recentSection.children('.collection').append(
      $("<li>").addClass('collection-item').text(recents[i])
    );
  }
}


// display recipe on screen 
var getRecipeByIngredients = function(title, image, main, other, instructions) {
  // clear html for recipe content 
  recipeContent.html("");
  // create elememts
  var recipeTitle = $("<h3>").text(title);
  var recipeImg = $("<img>").attr('src', image);
  var divContainer = $("<div>").addClass("row");

  var divCol1 = $("<div>").addClass('col s12 l6');
  var divCol2 = $("<div>").addClass('col s12 l6');

  var divMain = $("<div>").addClass('main-ingredients col s12').append(
    $("<h5>").text('Main Ingredients'),
    $("<ul>").addClass('collection')
  );
  var divOther = $("<div>").addClass('other-ingredients col s12').append(
    $("<h5>").text('Other Ingredients'),
    $("<ul>").addClass('collection')
  );
  var divRecipe = $("<div>").addClass('instructions col s12').append(
    $("<h5>").text('Instructions'),
    $("<ul>").addClass('collection')
  );
  divCol1.append(divMain, divOther);
  divCol2.append(divRecipe);
  divContainer.append(divCol1, divCol2);  
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
  recipeContent.append(recipeTitle, recipeImg, divContainer);
  pushToRecents(recipeTitle.text());
};

// function to display on page for get cuisine types
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

$("#showRecent").on('click', function() {
  $("#recents").removeClass("hide");
  $(".main-app").addClass("hide");
});
$("#backBtn").on('click', function() {
  $(".main-app").removeClass("hide");
  $("#recents").addClass("hide");
});

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
    console.log(data);
    var randomNum = Math.floor(Math.random() * data.hits.length);
    var food = data.hits[randomNum].recipe;
    getRecipeByCuisineType(food);
  }).catch(function(error) {
    recipeContent.html(`<h4>Recipe not Found</h4>
                        <p>Please make sure you enter your ingredients correctly!<p>`);
  });
});

loadRecents();
