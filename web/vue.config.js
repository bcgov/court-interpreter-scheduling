const webBaseHref = process.env.VUE_APP_RUN_IN_DOCKER? (process.env.WEB_BASE_HREF || '/' ): (process.env.WEB_BASE_HREF || '/court-interpreter-scheduling');
module.exports = {
  publicPath: webBaseHref,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: { '^/court-interpreter-scheduling': '' },
        secure: false,
        changeOrigin: true,
        headers: {
		      "X-Forwarded-Host": "localhost:8081",
          Connection: 'keep-alive'
        },
      }
    }
  },
  // crossorigin: "anonymous",
  chainWebpack: config => {
    config.module.rules.delete("eslint");
    config.module
	 .rule('vue')
      .use('vue-loader')
        .tap(options => {
          options.prettify = false
          return options
        });
      config.module.rule("ts")
      .test(/\.ts$/)
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      });
  },
  parallel: false // https://stackoverflow.com/questions/59951379/vue-cli-upgrade-from-v3-to-v4-breaks-build-process-with-thread-loader-error-can
};
