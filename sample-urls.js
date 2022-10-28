module.exports = {
  port: 4000,
  target: 'https://jsonplaceholder.typicode.com/',
  urlsGeneratingErrors: [
    {
      url: /\/todos\b/,
      probability: 0.9,
      codes: {
        '404': {
          weight: 0.9
        },
        '500': {
          weight: 0.1
        },
      }
    },
    {
      url: /\/posts\b/,
      probability: 0.05,
      codes: {
        '404': {
          weight: 0.7
        },
        '500': {
          weight: 0.3
        },
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