  $(document).ready(function(){
    $('select').formSelect();
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

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${finished}&number=100&apiKey=dbefcc9a25f8481a9786d8ffcf0b2c2e`).then(function(response) {
        return response.json();
    }).then(function(data) {
    // Have user select desired recipe
    //Store users data in a variable by getting the id of that recipe
    console.log(data);
    //second fetch that would lead to the actual recipe that the user wants
    })
});
