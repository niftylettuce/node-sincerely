
# node-sincerely

Node.js library to access [Sincerely's Web API](https://sites.google.com/a/sincerely.com/shiplib/web-api).

## Quick start

```bash
npm install sincerely
```

## Example Usage

```js

var sincerely = require('sincerely')('your-app-key'');

// wip
```

## API

All methods take a callback as their last parameter.

The callback is called with an error code if needed, and then the repsonse.

* `sincerely.create`
* `sincerely.upload`
* `sincerely.debug`
* `sincerely.cancel`

More information on the API is available at <https://sites.google.com/a/sincerely.com/shiplib/web-api>.

## Tests

To run tests, install `vows`:

```bash
npm install vows
```

Then run:

```bash
SINCERELY_APP_KEY=your-app-key vows test/*
```

## Contributors

* Nick Baugh <niftylettuce@gmail.com>

## License

MIT Licensed
