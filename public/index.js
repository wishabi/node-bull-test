console.log("index.js loaded")


// Count fetcher
function fetch_count() {
  console.log("Fetching count")
  $.getJSON("/count", function(data) {
    console.log("Data:", data)
    set_count(data["count"])
  })
}

function set_count(count) {
  $("#count").text(count)
}

window.setInterval(function(){
  fetch_count()
}, 1000);