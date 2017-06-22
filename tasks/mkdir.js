module.exports = function(grunt) {
  /**
   * Define "mkdir" tasks.
   *
   * grunt mkdir:init
   *   Creates directories expected in the build directory.
   *
   * grunt mkdir:files
   *   Creates sites/default/files in the build/develop directory.
   */
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.config('mkdir', {
    init: {
      options: {
        create: [
          '<%= config.buildPaths.build %>/cache',
          '<%= config.buildPaths.build %>/docs',
          '<%= config.buildPaths.reports %>'
        ]
      }
    }
  });
};
