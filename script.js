var form = $('form');

/*var btn = $('.btn');

btn.on('click', function() {
    console.log('please');
})*/

//fires on form submit (ie clicking the submit button)
form.on('submit', function(event) {
    event.preventDefault();
    let inputCity = $('#citysearch').val()
    addCityButton(inputCity);
})

function addCityButton(cityName){
    //adds new city button below the form (in that column though)
    var formContainer = $('.form-container');
    var newBtn = $('<button>');
    newBtn.addClass('btn btn-secondary');
    //sets id to the name of the city
    newBtn.attr('id',cityName);
    newBtn.text(cityName);
    formContainer.append(newBtn); 
}