module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'public/dist/app.css': 'client/app/juke.scss'
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            appCss: {
                src: 'public/dist/app.css',
                dest: 'public/dist/app.min.css'
            }
        },
        notify: {
            js: {
              options: {
                message: 'JS files compiled', //required
              }
          },
          css: {
            options: {
              message: 'CSS files compiled', //required
            }
          }
        },
        watch: {
            css: {
                files: ['client/app/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin', 'notify:css'],
                options: {
                    livereload: 35551,
                    spawn: false
                }
            },
            js: {
                files: ['client/app/**/*.js'],
                tasks: ['shell:compileJS'],
                options: {
                    livereload: 35551,
                    spawn: false
                }
            }
        },
        shell: {
            compileJS: {
                command: 'cd scripts/ && sh browserify.sh && sh uglify.sh'
            }
        },
        clean: {
            dist: [
                'public/dist/app.min.js.map'
            ]
        },
        usebanner: {
            copyright: {
                options: {
                    position: 'top',
                    banner: '/* <%= pkg.name %> <%= pkg.version %> - <%= pkg.website %> */',
                    linebreak: true
                },
                files: {
                    src: ['public/dist/app.min.css', 'public/dist/app.min.js']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9']
            },
            css: {
                src: 'public/dist/app.css',
                dest: 'public/dist/app.css'
            }
        }
    });

    // Default task(s).
    grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);

    grunt.registerTask('deploy', [
        'sass', // concat converted files and normal files
        'autoprefixer',
        'cssmin', // minify js & css
        'usebanner:copyright' // insert banner
    ]);

};
