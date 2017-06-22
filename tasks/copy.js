module.exports = function(grunt) {
  /**
   * Define "copy" tasks.
   *
   * grunt copy:static
   *   Copies all files from src/static to the build/develop directory.
   * grunt rsync:tempbuild
   *   Duplicate Drupal docroot from temporary location to the final build
   *    target.
   * grunt copy:tempbuild
   *   Original implementation of rsync:tempbuild, preserved for backwards
   *   compatibility and Windows support.
   * grunt copy:defaults
   *   Copies Drupal's sites/default directory into the custom codebase.
   */
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rsync');

  grunt.config('copy.tempbuild', {
    options: {
      mode: true
    },
    files: [
      {
        expand: true,
        cwd: '<%= config.buildPaths.temp %>',
        src: ['**', '.**'],
        dest: '<%= config.buildPaths.develop %>',
        dot: true,
        follow: true
      }
    ]
  });

  grunt.config('rsync.tempbuild', {
    options: {
      args: [
        '-ahW',
        '--stats'
      ],
      src: '<%= config.buildPaths.temp %>/',
      dest: '<%= config.buildPaths.develop %>'
    }
  });

  grunt.config('rsync.static', {
    options: {
      args: [
        '-ahW',
        '--stats'
      ],
      src: '<%= config.srcPaths.drupal %>/www/',
      dest: '<%= config.buildPaths.develop %>/'
    }
  });

  grunt.config('copy.defaults', {
    options: {
      mode: true
    },
    files: [
      {
        expand: true,
        cwd: '<%= config.buildPaths.develop %>/sites/default',
        src: ['default*'],
        dest: '<%= config.srcPaths.drupal %>/sites/default'
      }
    ]
  });
};
