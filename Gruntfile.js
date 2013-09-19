module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    latte: {
      build: {
        inputDir: 'src/',
        outputDir: 'lib/'
      }
    }
  });

  grunt.loadNpmTasks('latte');
  
  grunt.registerTask('build', ['latte:build']);

  grunt.registerTask('test', []);

  // Default task(s).
  grunt.registerTask('default', ['build', 'test']);
};
