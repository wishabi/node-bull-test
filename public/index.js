console.log("index.js loaded")

function create_td(text) {
  var element = document.createElement("td")
  element.innerText = text
  return element
}

function create_job_row(index, job) {
  var row = document.createElement("tr")
  row.append(create_td(index))
  row.append(create_td(job.id))
  row.append(create_td(job["opts"]["priority"]))
  row.append(create_td(JSON.stringify(job["data"])))
  row.append(create_td(JSON.stringify(job["opts"])))
  return row
}

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
}, 250);

// Active job fetcher
function fetch_active_jobs() {
  // console.log("Fetching count")
  $.getJSON("/get_active", function(data) {
    // console.log("Response: ", data)
    $("#active_jobs tr").remove()
    $.each(data, function(index, job) {
      var row = create_job_row(index, job)
      $("#active_jobs").append(row)
    })
  })
}

window.setInterval(function() {
  fetch_active_jobs()
}, 250);

// Waiting job fetcher
function fetch_waiting_jobs() {
  // console.log("Fetching count")
  $.getJSON("/get_waiting", function(data) {
    // console.log("Response: ", data)
    $("#waiting_jobs tr").remove()
    $.each(data, function(index, job) {
      var row = create_job_row(index, job)
      $("#waiting_jobs").append(row)
    })
  })
}
window.setInterval(function() {
  fetch_waiting_jobs()
}, 250);


// "Add job" handler
function add_job_handler() {
  console.log("add_job_handler")
  var data = $("#data").val()
  var priority = $("#priority").val()
  var merchant_id = $("#merchant_id").val()
  console.log("Data: ", data, " | Priority: ", priority, " | Merchant Id: ", merchant_id)
  $.get("/add_job", { data: data, priority: priority, merchant_id: merchant_id}, function(data) {
    console.log("Response: ", data)
  })
}
$("#add_job").click(add_job_handler)

// "Add job batch" handler
function add_job_batch_handler() {
  console.log("add_job_batch_handler")
  var data = $("#data").val()
  var priority = $("#priority").val()
  var merchant_id = $("#merchant_id").val()
  var batch = $("#batch").val()
  console.log("Data: ", data, " | Priority: ", priority, " | Merchant Id: ", merchant_id, " | Batch: ", batch)
  for (let i = 0; i < batch; i ++) {
    $.get("/add_job", { data: data, priority: priority, merchant_id: merchant_id}, function(data) {
      console.log("Response: ", data)
    })
  }
}
$("#add_job_batch").click(add_job_batch_handler)

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