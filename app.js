var express = require('express')
  , lsq = require('lsq')
  , http = require('http')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , debug = require('debug')
  , methodOverride = require('method-override')
  , log = debug('app:log')
  , error = debug('app:error')
  , app = express()
  , tools = require('./tools')


var everyauth = require('everyauth')
  ,session = require('express-session');

everyauth.github
  .appId('b9fcf09cf94effdff42a')
  .appSecret('10303d48dbd0427179196bbb10c575d4e3e75b99')
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
    console.log({"_id":0,session:session,accessToken:accessToken,accessTokenExtra:accessTokenExtra, githubUserMetadata:githubUserMetadata})
    return {"_id":0,session:session,accessToken:accessToken,accessTokenExtra:accessTokenExtra, githubUserMetadata:githubUserMetadata}
  })
  .redirectPath('/#repo')

  app
  .set('port', process.env.PORT || 3000)
  .set('trust proxy', 1)
  .use(session({ secret: 'keyboard cat'}))
  .use(everyauth.middleware())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(methodOverride('_method'))
  .use(tools.getReportingInfo(tools.report))
  .use('/api/v1/',require('./api/v1'))
  .use(express.static('public'))
  .get('/',tools.homePage)
  .get('/test', tools.test)
  .get('/session', function(req,res){
    res.send(req.session)
  })
  .get('/health',tools.healthCheck)
  .listen(app.get('port'),function(){
    console.log("Express server listening on port " + app.get('port'))
  })
