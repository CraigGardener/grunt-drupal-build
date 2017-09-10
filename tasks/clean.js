module.exports = function(grunt) {
  /**
   * Define "clean" tasks to remove files and directories.
   *
   * grunt clean
   *   Removes build directory.
   *
   * grunt clean:sites
   *   Removes sites/default in the build/develop directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  var Help = require('../lib/help')(grunt);

  grunt.config('clean', {
    default: [
      '<%= config.buildPaths.develop %>/*',
      '<%= config.buildPaths.develop %>/.*'

    ],
    sites: [
      '<%= config.buildPaths.develop %>/sites',
      '!<%= config.buildPaths.develop %>/sites/all'
    ],
    temp: [
      '<%= config.buildPaths.temp %>'
    ]
  });

  Help.add({
    task: 'clean:default',
    group: 'Utilities',
    description: 'Use "clean" to remove the build output directory.'
  });
};
