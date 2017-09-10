module.exports = function(grunt) {
  // Initialize global configuration variables.
  var config = {
    config: {
      srcPaths: {
        drupal: "src",
        config: "config"
      },
      buildPaths: {
        build: "build",
        docker: "build/docker",
        package: "build/packages",
        reports: "build/reports",
        temp: "build/temp",
        develop: "web",
        web: "web-deploy"
      },
      srcFiles: [
        "!sites/*/files/**",
        "!xmlrpc.php",
        "!modules/php/*"
      ],
      projFiles: [
        "README*",
        "bin/**"
      ],
      phpcbf: {
        path: "vendor/bin/phpcbf"
      },
      phpcs: {
        path: "vendor/bin/phpcs"
      },
      phpmd: {
        path: "vendor/bin/phpmd"
      },
      drush: {
        cmd: "vendor/bin/drush"
      },
      behat: {
        flags: "--tags ~@wip"
      },
      eslint: true
    }
  };

  if (grunt.config.getRaw() === undefined) {
    grunt.initConfig(config);
  } else {
    grunt.config.merge(config);
  }

  grunt.config.merge({config: grunt.file.readJSON('Gruntconfig.json')});
  grunt.config.merge({
    pkg: grunt.file.readJSON('package.json')
  });

  var GDT = require('./lib/init')(grunt);
  GDT.init();

  // Wrap Grunt's loadNpmTasks() function to allow loading Grunt task modules
  // that are dependencies of Grunt Drupal Tasks.
  grunt._loadNpmTasks = grunt.loadNpmTasks;
  grunt.loadNpmTasks = function(mod) {
    var internalMod = grunt.file.exists(__dirname, 'node_modules', mod);
    var pathOrig;
    if (internalMod) {
      pathOrig = process.cwd();
      process.chdir(__dirname);
    }
    grunt._loadNpmTasks(mod);
    if (internalMod) {
      process.chdir(pathOrig);
    }
  };

  // Load all tasks from grunt-drupal-tasks.
  var path = require('path');
  grunt.loadTasks(path.join(__dirname, '/tasks'));

  // Define the default task to fully build and configure the project.
  var tasksDefault = [];

  // If the "--validate" option is given, add "validate" to default
  // tasks array.
  if (grunt.option('validate')) {
    tasksDefault.push('validate');
  }
  // If the "--validate" option is given, add "validate" to default
  // tasks array.
  if (grunt.option('dcr')) {
    tasksDefault.push('dcr');
  }

  // Process .make files if configured.
  if (grunt.config.get('config.srcPaths.make')) {
    // If build/develop exists, but is empty, skip the newer check.
    // This facilitates situations where the build/develop is generated as a mounted
    // directory point with a newer timestamp than the Drush Makefiles.
    //
    // We do not use the grunt-newer .cache with drushmake so skipping newer for
    // any one run does not impact later behavior.
    if (grunt.file.exists(grunt.config.get('config.buildPaths.develop') + '/index.php')) {
      tasksDefault.push('newer:drushmake:default');
    } else {
      tasksDefault.push('drushmake:default');
    }
  }

  // Wire up the generated docroot to our custom code.
  tasksDefault.push('scaffold');

  if (grunt.file.exists('./composer.lock') && grunt.config.get(['composer', 'install'])) {
    if (grunt.config.get(['composer', 'drupal-scaffold'])) {
      // Manually run `composer drupal-scaffold` since this is only automatically run on update.
      tasksDefault.unshift('composer:drupal-scaffold');
    }
    // Run `composer install` if there is already a lock file. Updates should be explicit once this file exists.
    tasksDefault.unshift('composer:install');
  } else if (grunt.config.get(['composer', 'update'])) {
    // Run `composer update` if no lock file exists. This forces `composer drupal-scaffold` to run.
    tasksDefault.unshift('composer:update');
  }

  grunt.registerTask('default', tasksDefault);

  // If the "--timer" option is given, enable time-grunt to show how long each
  // task takes.
  if (grunt.option('timer')) {
    require('time-grunt')(grunt);
  }

  require('grunt-log-headers')(grunt);
};
