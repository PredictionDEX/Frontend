/* eslint-disable import/extensions */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache.js');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  images: {
    domains: [
      'assets.zilchill.com',
      'zilchill.ams3.cdn.digitaloceanspaces.com',
      'zilchill.ams3.digitaloceanspaces.com',
      'cdn.sportmonks.com',
      'www.thesportsdb.com',
      'mpng.subpng.com',
      'predictiondex.fra1.digitaloceanspaces.com'
    ]
  }
};

const nextConfig = withPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching
})(
  config
);

module.exports = nextConfig;
