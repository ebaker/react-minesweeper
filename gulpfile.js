/* gulpfile.js */
 
// Load some modules which are installed through NPM.
var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var reactify = require('reactify');  // Transforms React JSX to JS.
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');  // To compile Stylus CSS.
var nodemon = require('gulp-nodemon');
var nib = require('nib');
var fontello = require('gulp-fontello');
var connect = require('gulp-connect');
 
// Define some paths.
var paths = {
  css: ['src/*.styl'],
  app_js: ['./src/app.jsx'],
  js: ['./src/*.js'],
  html: ['./src/index.html'],
  fontello: './src/fontello.json',
  dest: './build'
};
 
// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.
gulp.task('clean', function(done) {
  del([paths.dest + '/**/*.*'], done);
});

// Copy html
gulp.task('copy', function(){
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dest));
});
 
// Our CSS task. It finds all our Stylus files and compiles them.
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(stylus({use: [nib()]}))
    .pipe(gulp.dest(paths.dest + '/css'));
});

// Fontello
gulp.task('fontello', function(){
  return gulp.src(paths.fontello)
    .pipe(fontello())
    .pipe(gulp.dest(paths.dest + '/font'))
});
 
// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', function() {
  // Browserify/bundle the JS.
  browserify(paths.app_js)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.dest));
});
 
// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.fontello, ['fontello']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.app_js, ['js']);
});

gulp.task('serve', ['build', 'watch'], function(){
  connect.server({
    port: 3000,
    root: paths.dest,
    livereload: true
  });
});
 
gulp.task('start', function () {
  nodemon({
    script: 'server.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
  });
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'clean', 'css', 'fontello', 'js', 'copy']);
gulp.task('build', ['clean', 'css', 'fontello', 'js', 'copy']);
