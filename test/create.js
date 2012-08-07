
// # node-sincerely

// ## create

var vows         = require('vows')
  , assert       = require('assert')
  , fs           = require('fs')
  , path         = require('path')
  , appKey       = process.env.SINCERELY
  , Landscape6x4 = path.join(__dirname, '..', 'Landscape6x4.jpg')
  , Portrait4x6  = path.join(__dirname, '..', 'Portrait4x6.jpg');

if (!appKey) throw new Error('Missing SINCERELY environment variable for application key.');

var sincerely = require('../lib/main.js')(appKey);

vows.describe('create').addBatch({

  'Upload an image and create the order for the postcard': {
    topic: function() {
      var that = this;
      fs.readFile(Landscape6x4, function(err, data) {
        assert.isNull(err);
        assert.isDefined(data);
        sincerely.upload({
          photo: new Buffer(data).toString('base64')
        }, function(err, response) {
          assert.isNull(err);
          assert.isDefined(response);
          assert.isDefined(response.id);
          sincerely.create({
              message: "These aren't the droids you're looking for."
            , frontPhotoId: response.id
            , profilePhotoId: response.id
            , recipients: [
                {
                    "name": "Matt Brezina"
                  , "email": "matt@sincerely.com"
                  , "company": "Sincerely, Inc."
                  , "street1": "800 Market St."
                  , "street2": "Floor 6"
                  , "city": "San Francisco"
                  , "state": "CA"
                  , "postalcode": "94102"
                  , "country": "United States"
                }
              ]
            , sender: {
                  name: "Nick Baugh"
                , email: "niftylettuce@gmail.com"
                , company: ""
                , street1: "123 Lettuce Lane"
                , street2: ""
                , city: "Sebastopol"
                , state: "CA"
                , postalcode: "95476-2222"
                , country: "United States"
              }
          }, that.callback);
        });
      });
    },
    'returns response with order ID': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
    }
  }

}).export(module, { error: false });
