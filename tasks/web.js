module.exports = function(grunt, config, tasks) {
  /**
   * Define "web" tasks.
   *
   * grunt web
   *   Copies web files to web directory.
   */

  var Help = require('../lib/help')(grunt);
  var path = require('path');

  grunt.registerTask('web', 'Copy the operational codebase for deployment.', function() {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rsync');

    var config = grunt.config.get('config');

    var srcFiles = ['**', '!**/.gitkeep'].concat((config && config.srcFiles && config.srcFiles.length) ? config.srcFiles : '**');

    // Look for a package target spec, build destination path.
    var destPath = grunt.config.get('config.buildPaths.web');
    var tasks = [];

    grunt.config('copy.web', {
      files: [
        {
          expand: true,
          cwd: '<%= config.buildPaths.develop %>',
          src: srcFiles,
          dest: path.resolve(destPath),
          dot: true,
          follow: false
        }
      ],
      options: {
        gruntLogHeader: false,
        mode: true
      }
    });

    grunt.config('rsync.web-sites', {
      options: {
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/sites/',
        dest: path.resolve(destPath, 'sites/')
      }
    });
    grunt.config('rsync.web-modules', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/modules/',
        dest: path.resolve(destPath, 'sites/all/modules/')
      }
    });
    grunt.config('rsync.web-profiles', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/profiles/',
        dest: path.resolve(destPath, 'profiles/')
      }
    });
    grunt.config('rsync.web-themes', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/themes/',
        dest: path.resolve(destPath, 'sites/all/themes/')
      }
    });
    grunt.config('rsync.web-libraries', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/libraries/',
        dest: path.resolve(destPath, 'sites/all/libraries/')
      }
    });
    grunt.config('rsync.web-www', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/www/',
        dest: path.resolve(destPath)
      }
    });

    grunt.config.set('clean.web', [destPath]);

    tasks.push('clean:web');
    tasks.push('copy:web');
    tasks.push('rsync:web-sites');
    tasks.push('rsync:web-modules');
    tasks.push('rsync:web-libraries');
    tasks.push('rsync:web-themes');
    tasks.push('rsync:web-profiles');
    tasks.push('rsync:web-www');

    if (this.args[0] && this.args[0] === 'build') {
    }

    grunt.task.run(tasks);
  });

  Help.add({
    task: 'web',
    group: 'Operations'
  });
};
