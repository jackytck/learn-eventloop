process.env.UV_THREADPOOL_SIZE = 1 // every child in the cluster would have 1 thread
// const crypto = require('crypto')
const express = require('express')
const app = express()
const Worker = require('webworker-threads').Worker

function doWork (res) {
  const worker = new Worker(function () {
    // inside worker, handle server's postMessage
    this.onmessage = function () {
      let counter = 0
      while (counter < 1e9) {
        counter++
      }
      // worker to server
      postMessage('' + counter)
    }
  })

  // server side, handle from worker's postMessage
  worker.onmessage = function (message) {
    console.log(message.data)
    res.send(message.data)
  }

  // server to worker
  worker.postMessage()
}

// I'm a child, I'm going to act like a server
// and do nothing else
app.get('/', (req, res) => {
  doWork(res)
})

app.get('/fast', (req, res) => {
  res.send('This was fast!')
})

app.listen(3000, () => console.log('Listening at http://127.0.0.1:3000...'))
