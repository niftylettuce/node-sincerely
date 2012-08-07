
//     node-sincerely
//     Copyright (c) 2012 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed

// Open source node.js module for accessing Sincerely's Web API:
// <https://sites.google.com/a/sincerely.com/shiplib/web-api>

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/node-sincerely>

// # node-sincerely

// Here are the `sincerely` methods returned from using `require('sincerely')`.
//
// You _must_ pass `your-app-key` string from <https://dev.sincerely.com/apps>.
//  (e.g. `var sincerely = require('sincerely')('your-app-key');`)
//
// All methods returned use a callback (`cb`), as their last parameter.
//  This `cb` is called with an error code (if any) and then the response.
//
// You _must_ refer to <https://sites.google.com/a/sincerely.com/shiplib/web-api> for your `data` objects.

var querystring = require('querystring')
  , path        = require('path')
  , package     = path.join(__dirname, 'package.json')
  , version     = require(package).version;

function responseHandler(req, callback) {
  if (typeof callback !== "function") {
    console.log("missing callback");
    return;
  }
  req.on('response', function(res) {
    var response = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response += chunk;
    });
    res.on('end', function() {
      var err = 200 == res.statusCode ? null : res.statusCode;
      try {
        response = JSON.parse(response);
      }
      catch(e) {
        err = 1;
        response = { error : { message : "Invalid JSON from Sincerely's Ship Library Web API." } };
      }
      err && (err = { statusCode: err, response: response });
      callback(err, response);
    });
  });
}

module.exports = function(appKey https) {

  if(typeof appKey !== 'string') {
    console.log('node-sincerely app key was not defined.');
    return;
  }

  function prepareRequest(method, path, data, cb) {

    if (typeof cb !== 'function') {
      console.log('node-sincerely missing callback');
      return;
    }

    Object.keys(data).forEach(function(key) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        var o = data[key];
        delete data[key];
        Object.keys(o).forEach(function(k) {
          var new_key = key + "[" + k + "]";
          data[new_key] = o[k];
        });
      }
    });

    var requestData = querystring.stringify(data);
    requestData = 'key=' + apiKey + '&' + requestData;

    var headers = {
      'Accept'           : 'application/json',
      'User-Agent'       : 'node-sincerely',
      'X-Node-Sincerely' : version
    };

    var post = false;
    switch (method) {
      case 'POST':
        headers['Content-Length'] = requestData.length;
        headers['Content-Type']   = 'application/x-www-form-urlencoded';
        //var auth = 'Basic ' + new Buffer(apiKey + ":").toString('base64');
        //headers.Authorization = auth;
        post = true;
        break;
      case 'GET':
        path = path + '?' + requestData;
        break;
    }

    var http, port;
    if (https) {
      http = require('https');
      port = '443';
    } else {
      http = require('http');
      port = '80';
    }

    var requestOptions = {
      host    : 'snapi.sincerely.com/shiplib',
      port    : port,
      path    : path,
      method  : method,
      headers : headers
    };

    var req = http.request(requestOptions);
    responseHandler(req, cb);
    if (post) req.write(requestData);
    req.end();

  };

  // # Methods
  var get = function(path, data, cb) {
    prepareRequest('GET', path, data, cb);
  };
  var post = function(path, data, cb) {
    prepareRequest('POST', path, data, cb);
  };

  return {

    // # Upload
    upload: function(data, cb) {
      post('/upload', data, cb);
    }

  };

};
