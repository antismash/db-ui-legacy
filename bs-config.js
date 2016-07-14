var proxyMiddleware = require('http-proxy-middleware');

module.exports = {
  port: 3000,
  files: ["./dist/**/*.{html,css,js,less}"],
  server: {
    baseDir: './dist',
    middleware: {
      1: proxyMiddleware('/api', {
        target: 'http://localhost:5566',
      changeOrigin: true   // for vhosted sites, changes host header to match to target's host
      })
    }
  }
};
