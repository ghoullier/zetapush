// Karma configuration
// Generated on Thu Aug 18 2016 08:59:14 GMT+0200 (CEST)
const os = require('os');

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: ['../platform-legacy/dist/zetapush-platform-legacy.js', 'dist/zetapush-client.js', 'test/**/*.spec.js'],

    // list of files to exclude
    exclude: ['test/sandbox-alias.spec.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'coverage'],
    junitReporter: {
      outputDir: 'test/reports', // results will be saved as $outputDir/$browserName.xml
      outputFile: `junit-${os.type()}-${os.release()}.xml` // if included, results will be saved as $outputDir/$browserName/$outputFile
      // suite: '', // suite will become the package name attribute in xml testsuite element
      // useBrowserName: true, // add browser name to report and classes names
      // nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      // classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      // properties: {} // key value pair of properties to add to the <properties> section of the report
      // xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },

    coverageReporter: {
      // specify a common output directory
      dir: '.',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'coverage/report-html' },
        { type: 'lcov', subdir: 'coverage/report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: 'coverage', file: 'cobertura-coverage.xml' },
        { type: 'json', subdir: '.nyc_output', file: 'client.json' }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],
    browserDisconnectTolerance: 5, // needed for Jenkins
    browserDisconnectTimeout: 10000, // needed for Jenkins
    browserSocketTimeout: 60000, // needed for Jenkins

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Custom Launchers
    // configure custom launchers
    customLaunchers: {}
  });
};
