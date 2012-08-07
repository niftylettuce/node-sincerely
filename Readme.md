
# node-sincerely <sup>0.0.1</sup>

Node.js library to access [Sincerely's Ship API](https://dev.sincerely.com/docs).

## Quick start

```bash
npm install sincerely
```

## Example Usage

```js
var sincerely    = require('sincerely')('your-app-key')
  , path         = require('path')
  , fs           = require('fs')
  , Landscape6x4 = path.join(__dirname, 'Landscape6x4.jpg')
  , Portrait4x6  = path.join(__dirname, 'Portrait4x6.jpg');

// you could use the `async` module here to parallel
//  load a `frontPhotoId` and a `profilePhotoId`

// read the file as a base64 string
fs.readFile(Landscape6x4, function(err, data) {

  // check for errors while reading the file
  if (err) throw new Error(err);

  // upload an image asset so we can create a new postcard
  sincerely.upload({
    photo: new Buffer(data).toString('base64')
  }, function(err, response) {

    // check for errors while uploading the image
    if (err) return console.log(err);

    // create a new order and mail the postcard
    sincerely.create({
        message: "These aren't the droids you're looking for."
      , frontPhotoId: response.id
      , profilePhotoId: response.id
      , recipients: [
          {
              id: 12345
            , name: "Matt Brezina"
            , email: "matt@sincerely.com"
            , company: "Sincerely, Inc."
            , street1: "800 Market St."
            , street2: "Floor 6"
            , city: "San Francisco"
            , state: "CA"
            , postalcode: "94102"
            , country: "United States"
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
    }, function(err, response) {

      // check for errors while creating the order
      if (err) return console.log(err);

      // output the response
      return console.log(response);

    });

  });

});
```

## API

All methods take a `data` object as their first parameter and a `callback(err, response)` as their last parameter.

* `sincerely.create` - Create a new order for the purposes of mailing a physical print and returns success or error.
* `sincerely.upload` - Uploads an image asset and returns an id that can be used when calling `sincerely.create`.
* `sincerely.debug` - Outputs a print preview PDF showing you waht the final print will look like.  Please note that this should be used for debug purposes only and should not be output to the end user.
* `sincerely.cancel` - Cancel a print placed via the api before it ships.  Prints are usually sent to production 2-4 hours from initial creation.

Documentation for these methods can be found at [Sincerely's RESTful web api ("Ship API")](https://dev.sincerely.com/docs).

## Tests

To run tests, install `vows`:

```bash
npm install vows
```

Then run:

```bash
SINCERELY=your-app-key vows test/*
```

## Contributors

* Nick Baugh <niftylettuce@gmail.com>

## License

MIT Licensed
