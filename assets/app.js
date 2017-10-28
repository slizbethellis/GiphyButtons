// array of TV Show names to create initial set of buttons
var topics = ["A Bit of Fry and Laurie", "Big Train", "Blackadder", "Black Books", "Burn Notice", "Doctor Who", "Father Ted", "Green Wing", "The IT Crowd", "Monty Python's Flying Circus", "Leverage", "The Office UK", "Portlandia", "Psych", "Red Dwarf", "Sherlock", "Spaced", "Star Trek The Next Generation", "Twin Peaks", "The Young Ones"];
// stores result of AJAX request
var results;

// calls the Giphy API and returns 10 images based on search query
function displayRelatedGifs() {
	var tvShow = $(this).attr("data-name");
	// limit is higher than needed number of images to reduce the odds of fewer than 10 images showing due to ratings
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + tvShow + "&api_key=Qep4iREiW7PuKQhrFdSBZqq2SSMLYmxd&limit=20";
	var acceptableGifs = 0;

	$("#gif-div").empty();

	// performs AJAX GET request
	$.ajax({
    url: queryURL,
    method: "GET"
  })
  .done(function(response) {
  	results = response.data;
  	var acceptableGifs = 0;
  	for (var i = 0; i < results.length; i++) {
  		if (acceptableGifs === 10) {
  			break;
  		}
  		else if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
  			var gDiv = $("<div>").addClass("gif-container");
  			var rating = results[i].rating;
  			var p = $("<p>").addClass("rating-text");
  			p.text("Rating: " + rating);
  			var resultImage = $("<img>");
  			resultImage.addClass("gif");
  			resultImage.attr("src", results[i].images.fixed_height_still.url);
  			resultImage.attr("data-still", results[i].images.fixed_height_still.url);
  			resultImage.attr("data-animate", results[i].images.fixed_height.url);
  			resultImage.attr("data-num", i);
  			resultImage.attr("data-state", "still");
  			gDiv.append(p);
  			gDiv.prepend(resultImage);
  			$("#gif-div").append(gDiv);
  			acceptableGifs++;
  		}
  	}
  });
}

// clears current buttons (if they exist) and creates a set of buttons from topics array
function makeButtons() {
	$("#button-div").empty();
	for (var i = 0; i < topics.length; i++) {
		var a = $("<button>");
		a.addClass("tv-show");
		a.attr("data-name", topics[i]);
		a.text(topics[i]);
		$("#button-div").append(a);
	}
}

// this call displays initial buttons
window.onload = function() {
	makeButtons();
	// event listener for TV show buttons
	$(document).on("click", ".tv-show", displayRelatedGifs);

	// animates or freezes image clicked on
	$(document).on("click", ".gif", function() {
		console.log(this);
		var state = $(this).attr("data-state");
		console.log(state);
		if (state === "still") {
	    $(this).attr("src", $(this).attr("data-animate"));
	    $(this).attr("data-state", "animate");
	  }
	  else {
	    $(this).attr("src", $(this).attr("data-still"));
	    $(this).attr("data-state", "still");
	  }
	});

	//
	$(document).on("click", "#add-show", function(event) {
	  event.preventDefault();
	  var tvShow = $("#tv-input").val().trim();
	  topics.push(tvShow);
	  makeButtons();
	});
}