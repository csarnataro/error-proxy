const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
  loggerPlugin, // log proxy events to a logger (ie. console)
  errorResponsePlugin, // return 5xx response on proxy error
  proxyEventsPlugin, // implements the "on:" option
} = require('http-proxy-middleware');

const { possiblyGenerateErrorCode } = require('./generate-http-error-code');

if (!process.argv[1]) {
  console.error(`File not found`)
}
const urls = require('./' + process.argv[process.argv.length - 1]);

const { urlsGeneratingErrors, port, target, prefix } = urls;

const app = express();

app.use(
  '*',
  createProxyMiddleware({
    target,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],    
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    followRedirects: true,
    onProxyReq: (proxyReq, req, res) => {
      try {
        possiblyGenerateErrorCode(req.url, urlsGeneratingErrors)
      } catch (err) {
        if (err.cause === 'close') {
          console.log('Connection closed');
          res.socket.destroy();
          return;
        }
        res.status(err.cause).send({
          message: err.message
        });        
      }
    },
    onError: (err, req, res, target) => {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Something went wrong. And we are reporting a custom error message.');
    }
  }
  ));

console.log(`Starting server on port ${port}`);
app.listen(port);