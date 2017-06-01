const http = require('https')
var hipchatConfig = require('./hipchat.json')

exports.handler = function (event, context) {
  var hipchatColor = 'purple';
  var messages = ['(standup) Please submit your standup report',
    '(standup) Get up and standup',
    '(standup) Go for a walk around the office and then come back to submit your standup report',
    '(standup) Hey! You! Standup report time',
    '(standup) Standup!!!!',
    '(standup) Time to standup',
    '(standup) Remember to drink lots of water, then do standup report',
    '(standup) (yodawg) I heard you like standups so I put a standup in your standup'
  ]
  var message = messages[Math.floor(Math.random() * messages.length)]
  var hipchatMessage = '{"color":"' + hipchatColor + '","message":"' + message + '","notify":true,"message_format":"text"}'
  console.log('hipchat message: ' + hipchatMessage)
  console.log('hipchat host: ' + hipchatConfig.host)

  var httpOptions = {
    host: hipchatConfig.host,
    port: 443,
    method: 'POST',
    path: '/v2/room/' + hipchatConfig.room + '/notification?auth_token=' + hipchatConfig.token,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  var req = http.request(httpOptions, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk)
    })
    res.on('end', function () {
      console.log(res.statusCode)
      if (res.statusCode === 204) {
        console.log('success')
        context.succeed('message delivered to hipchat')
      } else {
        console.log('failed')
        context.fail('hipchat API returned an error')
      }
    })
  })

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
    context.fail('failed to deliver message to hipchat')
  })

  req.write(hipchatMessage)
  req.end()
}
