console.log("Starting Processor")

const Path = require('path');
const Express = require('express')
const Queue = require('bull');

var bullQueue = new Queue('Just a bunch of Bull$#!#');

bullQueue.process(function(job, done) {
  console.log("Incoming $#!#:", job)
  done()
});

const app = Express()

app.use('/', Express.static(__dirname + '/public'));

app.get('/count', function(req, res) {
  console.log("/count")
  bullQueue.count().then(function(count) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      count: count
    }));
  })
})

app.get('/add_job', function(req, res) {
  console.log("/add_job")
  bullQueue.add(
    {
      data: "here is some data and things."
    },
    {
      priority: 9999
    }
  ).then(function() {
    res.send("Job added.")
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


app.listen(3000, () => console.log('Bull app listening on port 3000!'))