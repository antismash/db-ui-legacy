var proxyMiddleware = require('http-proxy-middleware');

var onProxyRes = function (proxyRes, res, req) {
  if (proxyRes.headers['location']) {
    proxyRes.headers['location'] = proxyRes.headers['location'].replace('http://localhost:5566', 'http://localhost:3000')
  }
}

module.exports = {
  port: 3000,
  open: false,
  files: ["./dist/**/*.{html,css,js,less}"],
  server: {
    baseDir: './dist',
    routes: {
      '/output': '../output'
    },
    middleware: {
      1: proxyMiddleware('/api', {
        target: 'http://localhost:5566',
        onProxyRes: onProxyRes,
        changeOrigin: true   // for vhosted sites, changes host header to match to target's host
      }),
      2: proxyMiddleware('/go', {
        target: 'http://localhost:5566',
        onProxyRes: onProxyRes,
        changeOrigin: true   // for vhosted sites, changes host header to match to target's host
      }),

    }
  }
};
