module.exports = {
  port: 4000,
  target: 'https://jsonplaceholder.typicode.com/',
  urlsGeneratingErrors: [
    {
      url: /\/todos\b/,
      probability: 0.6,
      codes: {
        '404': {
          weight: 0.3
        },
        '500': {
          weight: 0.3
        },
        'close': {
          weight: 0.3
        }
      }
    },
    {
      url: /\/posts/,
      probability: 0.8,
      codes: {
        '404': {
          weight: 0.3
        },
        '500': {
          weight: 0.3
        },
        'close': {
          weight: 0.3
        }
      }
    },
    {
      url: /\/photos\b/,
      probability: 0.1,
      codes: {
        '404': {
          weight: 0.7
        },
        '500': {
          weight: 0.3
        },
      }
    }
  ],
}