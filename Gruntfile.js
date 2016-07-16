module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/app.js',
        'public/js/directives/*.js',
        'public/js/controllers/*.js',
        'public/js/services/*.js'
      ],
      dest: 'public/dist/<%= pkg.name %>.js'
    }
  },
  jshint: {
    beforeconcat: ['public/js/**/*.js', 'public/js/app.js'],
    options: {
      force: 'true',
      ignores: [
        'public/lib/**/*.js',
      ]
    }
  },
  watch: {
    scripts: {
      files: ['public/js/**/*.js', 'public/*.js'],
      tasks: ['build']
    }
  },
});

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');


grunt.registerTask('build', [
  'jshint',
  'concat',
]);

}
