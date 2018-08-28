var http = require('http')

function checkConnection() {
  var req = http.request('http://localhost:8529', function(res) {

    res.on('data', function(chunk) {
      // chunks.push(chunk)
    })

    res.on('end', function() {
      // var body = Buffer.concat(chunks)
      // console.log(body.toString())
      setTimeout(run, 1000)
    })
  })

  req.on('error', function() {
    setTimeout(checkConnection, 1000)
  })

  req.end()
}

checkConnection()