# Error proxy

> A simple HTTP Proxy which randomly generates HTTP errors.

Based on the configurations, it will proxy some of the incoming requests to
the specified remote server, while some of them will just generate random HTTP errors (e.g. 404, 500, etc).

### Use case

You may want to check that your application is tolerant to remote API failures.

Since you may not have control on the remote API (either because they're third party code, or the backend guys are not that collaborative), you need a way to mock the API so that you get some errors every now and then.

Somehow similar to [Shopify Toxiproxy](https://github.com/Shopify/toxiproxy) or [requestly.io](https://requestly.io). But with way less features!

### Usage

1. Clone the repo
1. Install dependencies
1. Launch the proxy on your local machine

```shell
$ git clone https://github.com/csarnataro/error-proxy

$ cd error-proxy

$ npm install

$ npm run start sample-urls.js
```

The proxy should start on port 4000. You can check the result in
your browser navigating to http://localhost:4000/posts

### Configurations
A configuration file is a JS module which exports an object with this shape:
```javascript
module.exports = {
  port: 4000,
  target: 'https://example.com/api/v1',
  urlsGeneratingErrors: [...]
}
```

`port` - is the port at which the app is running.

`target` - the remote server where all not-erroring requests are proxied to.
E.g. based on the example above, a request to the proxy at 
`http://localhost:4000/some-folder/some-resource` will be forwarded 
to `https://example.com/api/v1/some-folder/some-resource`. 
If - based on the provided configurations - we generate a 404 error, 
no call to the remote server will be done.

`urlsGeneratingErrors` - the configuration based on which we generate the errors.
They're in the form:
```javascript
  urlsGeneratingErrors: [
    {
      url: /\/todos\b/,
      probability: 0.9,
      codes: {
        '404': {
          weight: 0.8
        },
        '500': {
          weight: 0.2
        },
      }
    },
    [...]
```

`url` - is a regular expression against which the current request is matched.

`probability` - is the probability that this request will generate an error (between 0 and 1)

`codes` - the HTTP errors we can generate, with they're corresponding weight, i.e. relative probability.
E.g. in the example above, if we have an error (because of the `probability: 0.9`), then we have an 80% chance to generate a 404 error and a 20% chance to generate a 500 error.
A special error code of `close` will cause the socket to close abruptly, generating an empty response (which will likely produce a "Failed to fetch" error).


If no `codes` are provided, then (in case of an error) we generate a 500 error by default.

## Demo

1. Launch the dev server with command

```shell
$ npm run start sample-urls.js
```

2. Open `demo/index.html` in your browser (doesn't need to launch a local http server)

3. Just observe what's happening in the developer console.
  * Some of the requests to `localhost:4000` server will return 100 posts from the wonderful API https://jsonplaceholder.typicode.com/
  * Some of the requests will return a 404 or 500 error. The page will show which error occurred 

### Development

`error-proxy` is a Javascript web app, runs in NodeJS on your local machine. 

It uses `express` and its middleware `http-proxy-middleware` under the hood.

### License

MIT
