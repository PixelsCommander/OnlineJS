/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '* <%= pkg.site %>\n' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                    '<%= pkg.author %>; Licensed BSD */\n'
            },
            dist: {
                files: {
                    'dist/online.min.js': ['src/online.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);

};
