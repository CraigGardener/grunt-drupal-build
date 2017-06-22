module.exports = function(grunt, config, tasks) {
  /**
   * Define "docker" tasks.
   *
   * grunt docker
   *   Builds a deployment docker package in the build/package directory.
   */

  var Help = require('../lib/help')(grunt);
  var path = require('path');

  grunt.registerTask('docker', 'Package the operational codebase for docker deployment. Use docker:build to create a docker image.', function() {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rsync');

    var config = grunt.config.get('config');

    var srcFiles = ['**', '!**/.gitkeep'].concat((config && config.srcFiles && config.srcFiles.length) ? config.srcFiles : '**');

    // Look for a package target spec, build destination path.
    var destPath = grunt.config.get('config.buildPaths.docker');
    var tasks = [];

    grunt.config('copy.docker', {
      files: [
        {
          expand: true,
          cwd: '<%= config.buildPaths.develop %>',
          src: srcFiles,
          dest: path.resolve(destPath, 'app'),
          dot: true,
          follow: false
        },
        {
          expand: true,
          cwd: 'config',
          src: '**',
          dest: path.resolve(destPath, 'config'),
          dot: true,
          follow: true
        },
        {
          expand: true,
          cwd: 'data',
          src: '**',
          dest: path.resolve(destPath, 'data'),
          dot: true,
          follow: true
        }
      ],
      options: {
        gruntLogHeader: false,
        mode: true
      }
    });

    grunt.config('rsync.docker-sites', {
      options: {
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/sites/',
        dest: path.resolve(destPath, 'app/sites/')
      }
    });
    grunt.config('rsync.docker-modules', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/modules/',
        dest: path.resolve(destPath, 'app/sites/all/modules/')
      }
    });
    grunt.config('rsync.docker-profiles', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/profiles/',
        dest: path.resolve(destPath, 'app/profiles/')
      }
    });
    grunt.config('rsync.docker-themes', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/themes/',
        dest: path.resolve(destPath, 'app/sites/all/themes/')
      }
    });
    grunt.config('rsync.docker-libraries', {
      options: {
        exclude: ["node_modules"],
        args: [
          '-ahW',
          '--stats'
        ],
        src: '<%= config.srcPaths.drupal %>/libraries/',
        dest: path.resolve(destPath, 'app/sites/all/libraries/')
      }
    });

    grunt.config.set('clean.docker', [destPath]);

    tasks.push('clean:docker');
    tasks.push('copy:docker');
    tasks.push('rsync:docker-sites');
    tasks.push('rsync:docker-modules');
    tasks.push('rsync:docker-libraries');
    tasks.push('rsync:docker-themes');
    tasks.push('rsync:docker-profiles');

    if (this.args[0] && this.args[0] === 'build') {
    }

    grunt.task.run(tasks);
  });

  Help.add({
    task: 'docker',
    group: 'Operations'
  });
};
