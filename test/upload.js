
// # node-sincerely

// ## upload

var vows         = require('vows')
  , assert       = require('assert')
  , fs           = require('fs')
  , path         = require('path')
  , appKey       = process.env.SINCERELY
  , Landscape6x4 = path.join(__dirname, '..', 'Landscape6x4.jpg')
  , Portrait4x6  = path.join(__dirname, '..', 'Portrait4x6.jpg');

if (!appKey) throw new Error('Missing SINCERELY environment variable for application key.');

var sincerely = require('../lib/main.js')(appKey);

vows.describe('upload').addBatch({

  'Upload a landscape image and return its photo ID': {
    topic: function() {
      var that = this;
      fs.readFile(Landscape6x4, function(err, data) {
        assert.isNull(err);
        assert.isDefined(data);
        sincerely.upload({
          photo: new Buffer(data).toString('base64')
        }, that.callback);
      });
    },
    'returns response with photo ID': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
    }
  },

  'Upload a portrait image and return its photo ID': {
    topic: function() {
      var that = this;
      fs.readFile(Portrait4x6, function(err, data) {
        assert.isNull(err);
        assert.isDefined(data);
        sincerely.upload({
          photo: new Buffer(data).toString('base64')
        }, that.callback);
      });
    },
    'returns response with photo ID': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
    }
  }

}).export(module, { error: false });
