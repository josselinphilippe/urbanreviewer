module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    watch: true
                },
                src: 'js/main.js',
                dest: 'js/bundle.dev.js'
            },
            production: {
                options: {
                    watch: true
                },
                src: 'js/main.js',
                dest: 'js/bundle.js'
            }
        },

        cssmin: {
            minify: {
                src: 'css/style.css',
                dest: 'css/style.min.css'
            }
        },

        jshint: {
            all: {
                files: {
                    src: [
                        'js/*.js',
                        '!<%= browserify.dev.dest %>',
                        '!<%= browserify.production.dest %>',
                        '!<%= uglify.production.dest %>'
                    ]
                }
            }
        },

        less: {
            development: {
                options: {
                    paths: ["css"],
                    yuicompress: true
                },
                files: {
                    "css/style.css": "css/style.less"
                }
            }
        },

        handlebars: {
            compile: {
                files: {
                    "handlebars_templates/handlebars_templates.js" : "handlebars_templates/*.hbs"
                }
            }
        },

        uglify: {
            production: {
                src: '<%= browserify.production.dest %>',
                dest: 'js/bundle.min.js'
            }
        },

        watch: {
            jshint: {
                files: ['js/*.js'],
                tasks: ['jshint']
            },

            less: {
                files: ["css/*.less", "css/*/*.less"],
                tasks: ["less", "cssmin"]
            },

            handlebars: {
                files: ["handlebars_templates/*.hbs"],
                tasks: ['handlebars']
            },

            uglify: {
                files: ['<%= browserify.production.dest %>'],
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['browserify', 'watch']);
};
