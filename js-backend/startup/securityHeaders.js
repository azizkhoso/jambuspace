const helmet = require('helmet');

module.exports = function (app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com/',
            'https://cdn.linearicons.com/',
          ],
          fontSrc: ["'self'", 'https://cdn.linearicons.com/', 'https://fonts.gstatic.com/'],
          imgSrc: ["'self'", 'blob:'],
          objectSrc: ["'self'", 'blob:'],
          baseUri: 'self',
          upgradeInsecureRequests: [],
        },
      },
    }),
  );
  app.use(helmet.dnsPrefetchControl({ allow: true }));
};
