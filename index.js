process.env.UV_THREADPOOL_SIZE = 1 // every child in the cluster would have 1 thread
const cluster = require('cluster')
const crypto = require('crypto')
const express = require('express')
const app = express()

function doWork (res) {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Hi there')
  })
}

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but
  // in child mode
  cluster.fork()
  cluster.fork()
} else {
  // I'm a child, I'm going to act like a server
  // and do nothing else
  app.get('/', (req, res) => {
    doWork(res)
  })

  app.get('/fast', (req, res) => {
    res.send('This was fast!')
  })

  app.listen(3000, () => console.log('Listening at 127.0.0.1:3000...'))
}
