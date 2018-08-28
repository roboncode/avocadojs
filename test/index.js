var http = require('http')

function checkConnection() {
  var req = http.request('http://localhost:8529', function(res) {
    res.on('data', function(chunk) {})

    res.on('end', function() {
      setTimeout(run, 1000)
    })
  })

  req.on('error', function() {
    setTimeout(checkConnection, 1000)
  })

  req.end()
}

checkConnection()
