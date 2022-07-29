var form = $('form');

/*var btn = $('.btn');

btn.on('click', function() {
    console.log('please');
})*/

//fires on form submit (ie clicking the submit button)
form.on('submit', function(event) {
    event.preventDefault();
    let inputEl = $('#citysearch');
    let inputCity = inputEl.val().trim();
    //check to see if this city is already in search history
    if (!$(`#${inputCity}`).length) {
        //if it is not, add it to the history bar
        addCityButton(inputCity);
    }
    //reset the input field to empty
    inputEl.val('');
})

function addCityButton(cityName){
    //adds new city button below the form (in that column though)
    var historyContainer = $('.history');
    var newBtn = $('<button>');
    newBtn.addClass('btn btn-secondary');
    //sets id to the name of the city
    newBtn.attr('id',cityName);
    newBtn.text(cityName);
    historyContainer.prepend(newBtn); 

    //count cities in recent history. if>7, delete the first one
    let buttonElems = historyContainer.children();
    if (buttonElems.length>7) {
        buttonElems.last().remove();
    }
}