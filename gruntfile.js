module.exports = function(grunt) {

    var SRC = 'src/';

    var src_files = [
        SRC + 'main.js',
        SRC + 'Page.js',
        SRC + 'Type.js',
        SRC + 'Interface.js',
        SRC + 'ScreenScraper.js',
        SRC + 'AjaxCall.js',
        SRC + 'AjaxSuccess.js',
        SRC + 'CitationFile.js',
        SRC + 'CitationText.js',
        SRC + 'close.js'
    ];

    grunt.initConfig({
        jshint: {
            files: src_files,
            options: {
                globals: {
                    jQuery: true
                },
                debug: true
            }
        },
        concat: {
            default: {
                src: src_files,
                dest: 'out.js'
            }
        },
        watch: {
            files: src_files,
            tasks: ['build']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('build', ['concat', 'jshint']); // linter
    // grunt.registerTask('build', ['concat']);
};