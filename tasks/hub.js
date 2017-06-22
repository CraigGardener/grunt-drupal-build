module.exports = function(grunt) {
  /**
   * Define "hub" tasks to TODO: Add description.
   *
   * grunt hub
   *   TODO: Add description.
   */
  grunt.loadNpmTasks('grunt-hub');
  var Help = require('../lib/help')(grunt);

  var librariesSrc = ["src/libraries/*/Gruntfile.js"];
  var modulesSrc = ["src/modules/*/Gruntfile.js", "src/modules/*/*/Gruntfile.js"];
  var profilesSrc = ["src/profiles/*/Gruntfile.js"];
  var themesSrc = ["src/themes/*/Gruntfile.js", "src/themes/*/*/Gruntfile.js"];
  var allSrc = [].concat(librariesSrc, modulesSrc, profilesSrc, themesSrc);

  grunt.config.merge({
    hub: {
      dependencies: {
        src: allSrc,
        tasks: ["dependencies"]
      },
      modules: {
        src: modulesSrc,
        tasks: ["compile"]
      },
      profiles: {
        src: profilesSrc,
        tasks: ["compile"]
      },
      themes: {
        src: themesSrc,
        tasks: ["compile"]
      },
      all: {
        src: allSrc,
        tasks: ["compile"]
      }
    }
  });

  Help.add(
    {
      task: 'hub',
      group: 'hub',
      description: 'Use "hub" to TODO: Add description.'
    },
    {
      task: 'hub:libraries',
      group: 'hub',
      description: 'Use "hub:libraries" to TODO: Add description.'
    },
    {
      task: 'hub:modules',
      group: 'hub',
      description: 'Use "hub:modules" to TODO: Add description.'
    },
    {
      task: 'hub:profiles',
      group: 'hub',
      description: 'Use "hub:profiles" to TODO: Add description.'
    },
    {
      task: 'hub:themes',
      group: 'hub',
      description: 'Use "hub:themes" to TODO: Add description.'
    }
  );
};
