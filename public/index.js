console.log("index.js loaded")

// Count fetcher
function fetch_count() {
  // console.log("Fetching count")
  $.getJSON("/count", function(data) {
    // console.log("Response: ", data)
    $("#active").text(data["active"])
    $("#waiting").text(data["waiting"])
    $("#completed").text(data["completed"])
    $("#failed").text(data["failed"])
    $("#delayed").text(data["delayed"])
  })
}

window.setInterval(function() {
  fetch_count()
}, 500);

// "Add job" handler
function add_job_handler() {
  console.log("add_job_handler")
  var data = $("#data").val()
  var priority = $("#priority").val()
  console.log("Data: ", data, " | Priority: ", priority)
  $.get("/add_job", { data: data, priority: priority }, function(data) {
    console.log("Response: ", data)
  })
}
$("#add_job").click(add_job_handler)

// Queue controls
$("#pause").click(function() {
  $.get("/pause", function(data) {
    console.log("Response: ", data)
  })
})
$("#resume").click(function() {
  $.get("/resume", function(data) {
    console.log("Response: ", data)
  })
})
$("#empty").click(function() {
  $.get("/empty", function(data) {
    console.log("Response: ", data)
  })
})