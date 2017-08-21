module.exports = {
  build_dir: "build",
  compile_dir: "dist",
  app_files: {
    js: [
      "src/**/*.js"
    ],
    jsunit: ["src/**/*.spec.js"],
    jse2e: ["src/**/*.scenario.js"],
    atpl: ["src/app/**/*.tpl.html"],
    ctpl: ["src/common/**/*.tpl.html"],
    html: ["src/index.html", "src/login-token.html"],
    sass: "src/sass/application.scss",
  },
  vendor_files: {
    js: [
      "bower_components/lodash/lodash.js",
      "bower_components/angular/angular.js",
      "bower_components/angular-ui-router/release/angular-ui-router.js",
      "bower_components/angular-local-storage/dist/angular-local-storage.js",
      "bower_components/jquery/dist/jquery.min.js",
      "bower_components/jquery-ui-dist/jquery-ui.min.js",
      "bower_components/d3/d3.js",
      "bower_components/moment/moment.js",
      "bower_components/moment-duration-format/lib/moment-duration-format.js",
      "bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js",
    ],
    css: [],
    assets: []
  }
};
