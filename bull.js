console.log("Starting Processor")

const Path = require('path');
const Express = require('express')
const Queue = require('bull');

const CLEAN_GRACE_PERIOD = 1000;

var bullQueue = new Queue(
  'Just a bunch of Bull$#!#',
  {
    limiter: { // RateLimiter
      max: 5         // Max number of jobs processed
    }
  }
);

bullQueue.process(function(job, done) {
  console.log("Incoming $#!#:")
  console.log("Data: ", job["data"])
  console.log("Options: ", job["opts"])
  console.log("-----------------------------------------------------")
  setTimeout(function() {
    done()
  }, 2000)
});

const app = Express()

app.use('/', Express.static(__dirname + '/public'));

app.get('/count', function(req, res) {
  // console.log("/count")
  bullQueue.getJobCounts().then(function(counts) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(counts, null, 3));
  })
})

app.get('/add_job', function(req, res) {
  console.log("/add_job")
  var data = req.query.data
  var priority = req.query.priority
  console.log("data:", data)
  console.log("priority:", priority)
  bullQueue.add(
    {
      data: data
    },
    {
      priority: priority
    }
  ).then(function() {
    res.send("Job added. Data: " + data + " | Priority: " + priority)
  });
})

app.get('/pause', function(req, res) {
  console.log("/pause")
  bullQueue.pause().then(function() {
    res.send("Queue is paused.")
  })
})

app.get('/resume', function(req, res) {
  console.log("/resume")
  bullQueue.resume().then(function() {
    res.send("Queue is resumed.")
  })
})

app.get('/empty', function(req, res) {
  console.log("/empty")

  var active_promise = bullQueue.clean(CLEAN_GRACE_PERIOD, 'active')
  var waiting_promise = bullQueue.clean(CLEAN_GRACE_PERIOD, 'waiting')
  var completed_promise = bullQueue.clean(CLEAN_GRACE_PERIOD, 'completed')
  var failed_promise = bullQueue.clean(CLEAN_GRACE_PERIOD, 'failed')
  var delayed_promise = bullQueue.clean(CLEAN_GRACE_PERIOD, 'delayed')

  Promise.all([
    active_promise,
    waiting_promise,
    completed_promise,
    failed_promise,
    delayed_promise
  ]).then(function() {
    res.send("Queues have been cleared with grace period of " + CLEAN_GRACE_PERIOD + " ms.")
  })
})

app.get('/get_jobs', function(req, res) {
  // console.log("/get_jobs")
  bullQueue.getJobs().then(function(jobs) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jobs, null, 3))
  })
})

app.get('/get_waiting', function(req, res) {
  // console.log("/get_waiting")
  bullQueue.getWaiting().then(function(jobs) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jobs, null, 3))
  })
})

app.get('/get_active', function(req, res) {
  // console.log("/get_active")
  bullQueue.getActive().then(function(jobs) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jobs, null, 3))
  })
})

app.listen(3000, () => console.log('Bull app listening on port 3000!'))
