module.exports = function(grunt) {

    var SRC = 'src/',
        EXT = 'extension/',
        src_files = [
            SRC + 'main.js',
            SRC + 'GEOPage.js',
            SRC + 'PubMedPage.js',
            SRC + 'DataMedPage.js',
            SRC + 'GEOType.js',
            SRC + 'DataMedType.js',
            SRC + 'Interface.js',
            SRC + 'ScreenScraper.js',
            SRC + 'PreAjax.js',
            SRC + 'AjaxCall.js',
            SRC + 'AjaxSuccess.js',
            SRC + 'CitationFile.js',
            SRC + 'CitationText.js',
            SRC + 'Abstract.js',
            SRC + 'close.js'
        ],
        ext_files = EXT + 'cite-d-lite.js';

    grunt.initConfig({
        jshint: {
            files: ext_files,
            options: {
                globals: {
                    jQuery: true
                },
                debug: true,
                unused: true,
                curly: true,
                eqeqeq: true,
                funcscope: true
            }
        },
        concat: {
            default: {
                src: src_files,
                dest: ext_files
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