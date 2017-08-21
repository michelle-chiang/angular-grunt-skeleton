var _ = require("lodash");

module.exports = function (grunt) {
  grunt.loadTasks("tasks");
  require("load-grunt-tasks")(grunt);

  var userConfig = require("./conf.build.js");

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner: ""
    },

    clean: [
      "<%= build_dir %>",
      "<%= compile_dir %>"
    ],

    connect: {
      options: {
        hostname: "*",
        port: grunt.option("http-port") || 4001 // SauceLabs only proxies certain ports. (4001 is one.)
      },

      compile: {
        options: {
          base: "<%= compile_dir %>"
        }
      },

      watch: {
        options: {
          base: "<%= build_dir %>",
          livereload: 40092
        }
      }
    },

    copy: {
      build_app_assets: {
        files: [
          {
            src: ["**"],
            dest: "<%= build_dir %>/assets/",
            cwd: "src/assets",
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: ["<%= vendor_files.assets %>"],
            dest: "<%= build_dir %>/assets/",
            cwd: ".",
            expand: true,
            flatten: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: ["<%= app_files.js %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: ["<%= vendor_files.js %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      build_vendorjson: {
        files: [
          {
            src: ["<%= vendor_files.json %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: ["**", "!*.css"],
            dest: "<%= compile_dir %>/assets",
            cwd: "<%= build_dir %>/assets",
            expand: true
          }
        ]
      },
      build_static: {
        files: [{
          src: ["src/robots.txt"],
          dest: "<%= build_dir %>/robots.txt",
          expand: false
        }]
      },
      compile_static: {
        files: [{
          src: ["src/robots.txt"],
          dest: "<%= compile_dir %>/robots.txt",
          expand: false
        }]
      }
    },

    exec: {
      options: {
        stdout: true,
        stderr: true,
        stdin: false
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true,
        stdin: false
      }
    },

    sass: {
      build: {
        files: {
          "<%= build_dir %>/assets/application.css": "<%= app_files.sass %>"
        }
      }
    },

    concat: {
      build_css: {
        options: {
          banner: "<%= meta.banner %>"
        },
        src: [
          "<%= build_dir %>/assets/application.css"
        ],
        dest: "<%= build_dir %>/assets/application.css"
      },
      compile_app_js: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= compile_dir %>/assets/vendor.js": ["<%= vendor_files.js %>"],
          "<%= compile_dir %>/assets/app.js": [
            "<%= build_dir %>/src/**/*.js",
            "<%= build_dir %>/assets/cldr-data.js",
            "<%= html2js.app.dest %>",
            "<%= html2js.common.dest %>"
          ]
        }
      }
    },

    cssmin: {
      compile: {
        src: ["<%= build_dir %>/assets/application.css"],
        dest: "<%= compile_dir %>/assets/app.css"
      }
    },

    html2js: {
      app: {
        options: {
          base: "src/app"
        },
        src: ["<%= app_files.atpl %>"],
        dest: "<%= build_dir %>/templates-app.js"
      },

      common: {
        options: {
          base: "src/common"
        },
        src: ["<%= app_files.ctpl %>"],
        dest: "<%= build_dir %>/templates-common.js"
      }
    },


    ngAnnotate: {
      compile: {
        files: [
          {
            src: ["<%= app_files.js %>"],
            cwd: "<%= build_dir %>",
            dest: "<%= build_dir %>",
            expand: true
          }
        ]
      }
    },

    uglify: {
      compile: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= compile_dir %>/assets/vendor.js": "<%= compile_dir %>/assets/vendor.js"
        }
      }
    },

    templates: {
      options: {
        get version () {
          // This is an ES5 getter to defer execution until we actually try to
          // build the template; otherwise we get this config value while grunt
          // is configuring its tasks, before we've run anything, which means
          // that we don't actually have a pkg.version value yet.
          return grunt.config("pkg.version");
        }
      },
      build_index: {
        dir: "<%= build_dir %>",
        file: "index.html",
        src: [
          "<%= vendor_files.js %>",
          "<%= html2js.common.dest %>",
          "<%= html2js.app.dest %>",
          "<%= build_dir %>/src/**/*.js",
          "<%= build_dir %>/assets/cldr-data.js",
          "<%= build_dir %>/assets/application.css"
        ]
      },
      compile_index: {
        dir: "<%= compile_dir %>",
        file: "index.html",
        src: [
          "<%= compile_dir %>/assets/vendor.js",
          "<%= compile_dir %>/assets/app.js",
          "<%= cssmin.compile.dest %>"
        ]
      }
    },

    testconfig: {
      unit: {
        src: [
          "<%= vendor_files.js %>",
          "<%= html2js.app.dest %>",
          "<%= html2js.common.dest %>"
        ]
      },

      e2e: {},

      imagecomp: {}
    },

    revmd5: {
      options: {
        relativePath: "./",
        safe: true
      },
      compile: {
        src: ["<%= compile_dir %>/**/*.html", "<%= compile_dir %>/**/*.css"]
      }
    },

    s3: {
      options: {
        accessKeyId: process.env.WHOOP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.WHOOP_AWS_SECRET_ACCESS_KEY,
        bucket: grunt.option("bucket"),
        region: "us-west-2",
        access: "public-read",
        overwrite: true,
        gzip: true,
        headers: {
          // Two-year cache policy (1000 * 60 * 60 * 24 * 365 * 2)
          CacheControl: "max-age=630720000, public",
          Expires: new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      deploy_assets: {
        cwd: "<%= compile_dir %>/",
        src: "assets/**/*",
        dest: ""
      },
      deploy_index: {
        files: [
          {
            src: "<%= compile_dir %>/index.html",
            dest: "index.html"
          }
        ],
        options: {
          headers: {
            CacheControl: "no-store",
            Expires: new Date(Date.now()).toUTCString()
          }
        }
      },
      deploy_robots: {
        cwd: "<%= compile_dir %>/",
        src: "robots.txt",
        dest: ""
      },
      deploy_login: {
        cwd: "<%= compile_dir %>/",
        src: "login-token.html",
        dest: "",
        options: {
          headers: {
            CacheControl: "no-store",
            Expires: new Date(Date.now()).toUTCString()
          }
        }
      }
    },

    delta: {
      options: {
        livereload: 40092,
        spawn: false,
        interrupt: !grunt.option("no-watch-interrupt")
      },

      html: {
        files: ["<%= app_files.html %>"],
        tasks: ["templates:build_index"]
      },

      sass: {
        files: [
          "src/sass/**/*.scss"
        ],
        tasks: ["sass:build"]
      },

      tpls: {
        files: ["<%= app_files.atpl %>", "<%= app_files.ctpl %>"],
        tasks: ["html2js"]
      },

      jssrc: {
        files: ["<%= app_files.js %>"],
        tasks: ["copy:build_appjs", "templates:build_index"]
      },

      assets: {
        files: ["src/assets/**/*"],
        tasks: ["copy:build_app_assets"]
      },

      gruntfile: {
        files: ["Gruntfile.js", "conf.build.js"],
        tasks: [],
        options: { livereload: false }
      }
    }
  };

  grunt.renameTask("watch", "delta");

  delete taskConfig.delta.jsunit;
  delete taskConfig.delta.jse2e;
  taskConfig.delta.jssrc.tasks = ["copy:build_appjs", "templates:build_index"];

  grunt.registerTask("watch", [
    "build",
    "connect:watch",
    "delta"
  ]);

  grunt.registerTask("skip", [
    "build",
    "connect:watch",
    "delta"
  ]);

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask("build", [
    "clean",
    "html2js",
    "sass:build",
    "concat:build_css",
    "copy:build_app_assets",
    "copy:build_vendor_assets",
    "copy:build_appjs",
    "copy:build_vendorjs",
    "copy:build_static",
    "templates:build_index"
  ]);

  grunt.registerTask("reckless-version-metadata", "Backfill placeholder Git revision into environment variable for reckless builds", function () {
    if (!process.env.WHOOP_WEB_GIT_REVISION) {
      process.env.WHOOP_WEB_GIT_REVISION = "reckless_build";
    }
  });

  grunt.registerTask("reckless-compile", [
    "build",
    "copy:compile_assets",
    "copy:compile_static",
    "ngAnnotate",
    "cssmin",
    "concat:compile_app_js",
    "uglify",
    "templates:compile_index",
    "revmd5",
  ]);

  grunt.registerTask("compile", [
    "clean",
    "build",
    "copy:compile_assets",
    "copy:compile_static",
    "cssmin",
    "concat:compile_app_js",
    "uglify",
    "templates:compile_index",
    "revmd5",
    "connect:compile"
  ]);

  grunt.registerTask("compile-sync", [
    "clean",
    "build",
    "copy:compile_assets",
    "copy:compile_static",
    "ngAnnotate",
    "cssmin",
    "concat:compile_app_js",
    "uglify",
    "templates:compile_index",
    "revmd5",
    "connect:compile",
    "keepalive"
  ]);

  var filterForJS = function (files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  };

  var filterForCSS = function (files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  };

  grunt.registerMultiTask("templates", "Process template", function () {
    var dirRE = new RegExp("^(" + grunt.config("build_dir") + "|" + grunt.config("compile_dir") + ")\/", "g");
    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, "");
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, "");
    });

    var templateData = {
      scripts: jsFiles,
      settings: this.options(),
      styles: cssFiles,
      version: grunt.config("pkg.version")
    };

    grunt.file.copy("src/" + this.data.file, this.data.dir + "/" + this.data.file, {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: templateData
        });
      }
    });
  });

  grunt.registerTask("run-regression", [
    "clean",
    "build",
    "testconfig",
    "exec:run_tests"
  ]);

  grunt.registerTask("run-scenario", [
    "testconfig",
    "exec:run_tests"
  ]);

  grunt.registerTask("run-tests", [
    "testconfig",
    (grunt.option("e2e-local") ? "shell:protractor_watch" : "exec")
  ]);

  grunt.registerTask("compile-test", ["compile", "keepalive"]);

  grunt.registerTask("default", ["watch"]);
};
