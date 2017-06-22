module.exports = function(grunt, config, tasks) {
  /**
   * Define "printConfig" task.
   */
  grunt.registerTask('printConfig', function() {
    grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
  });
};
