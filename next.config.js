const withBundleAnalyzer = require('@next/bundle-analyzer');
const withFiles = require('./build-tools/with-files');
const withConstants = require('./build-tools/with-constants');

const { BODY_MAX_SIZE_B } = require('./build-time-constants/global');

let config = withConstants();
config = withFiles({
  ...config,
  // inlineImageLimit
  // imageFileName
  // outputPath
  // publicPath
  // postTransformPublicPath
  // assetPrefix
  // basePath
  // fileExtensions
});
config = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(
  config
);

config.api = {
  ...config.api,
  bodyParser: {
    sizeLimit: `${BODY_MAX_SIZE_B}b`,
  },
};

module.exports = config;
