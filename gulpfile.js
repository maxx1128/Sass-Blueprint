var gulp        = require('gulp'),
    notify      = require('gulp-notify'),
    plumber     = require('gulp-plumber'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    scsslint    = require('gulp-scss-lint')
;  

// Find errors!
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

// Function for plumber to handle errors
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            // Custom error titles go here
            title: errTitle || 'Error running Gulp',
            message: "<%= error.message %>",
            sound: 'Submarine',
        })
    });
}

// Browser Sync settings and config
var bs_reload = {
    stream: true
};

gulp.task('browserSync', function() {
    var Settings = {
        files: ['test/**'],
        port: 4000,
        server: { baseDir: 'test' },
        reload: ({ stream: true}),
        notify: false
    };

    browserSync(Settings)
});


// Converts the Sass partials into a single CSS file
gulp.task('sass', function () {
    
    // Sass and styling variables
    var sassInput = '_sass/main.scss';
    var sassOptions = { 
        outputStyle: 'expanded'
    };

  return gulp
    .src(sassInput)
    .pipe(customPlumber('Error running Sass'))

    // Write Sass for either dev or prod
    .pipe(sass(sassOptions))

    .pipe(rename("style.css"))
    // Sends the Sass file to either the app or dist folder
    .pipe(gulp.dest('test'))
    .pipe(notify({ message: 'Sass Processed!', onLast: true }))
    .pipe(browserSync.reload(bs_reload))
});

// For linting the Sass files
gulp.task('scss-lint', function() {
  return gulp.src([
      '_sass/**/**/**/*.scss',
      '!_sass/_generic/_normalize.scss',
      '!_sass/_tools/_synapse.scss'
    ])
    .pipe(scsslint({
      'maxBuffer': 9999999999999999999999999999999999999999,
      'config': '.css-guidelines.yml'
    }))
});

// Task to watch the things!
gulp.task('watch', function(){
  gulp.watch('_sass/**/**/*.scss', ['sass']);
});

gulp.task('default', function(callback) {
  runSequence(
    'sass',
    ['browserSync', 'watch'],
    callback
  )
});
