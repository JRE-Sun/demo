var gulp = require('gulp'),
    babel = require('gulp-babel'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    changed = require('gulp-changed'),
    debug = require('gulp-debug'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber');

/* es6 */
gulp.task('es6', function() {
    return gulp.src('static/**/*.es6')
        .pipe(plumber({
            errorHandler: function(error) {
                this.emit('end');
            }
        }))  
        .pipe(babel())
        .pipe(changed('static/'))
        .pipe(debug())
        .pipe(gulp.dest('static/'));
});

gulp.task('sass', function() {
    return gulp.src('static/**/*.scss')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefix({
            browsers: ['last 2 versions', 'Android >= 4.0', '> 1%'],
            cascade: false,
        }))
        .pipe(changed('static/'))
        .pipe(debug())
        .pipe(gulp.dest('static/'))
});

gulp.task('watch', function() {
    gulp.watch('static/**/*.es6', ['es6']);
    gulp.watch('static/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);