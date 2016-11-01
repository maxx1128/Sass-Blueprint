var
    gulp    = require('gulp'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    rename  = require('gulp-rename'),
    sass    = require('gulp-sass')
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


// Converts the Sass partials into a single CSS file
gulp.task('sass', function () {
    
    // Sass and styling variables
    var sassInput = 'main.scss';
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
});

gulp.task('default', ['sass']);