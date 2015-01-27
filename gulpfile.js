'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var minifyCSS = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var glob = require('glob');
var sprite = require('css-sprite').stream;
var gulpif = require('gulp-if');
var mergeStream = require('merge-stream');


var settings = (function () {

    var _debug = process.env.NODE_ENV !== 'production';

    return Object.defineProperties(Object.create(null), {
        debug: {
            get: function () {
                return _debug;
            },
            set: function (newValue) {
                _debug = !!newValue;
            }
        },
        dest: {
            get: function () {
                return _debug ? 'dist' : 'build';
            }
        }
    });

})(); 



gulp.task('templates', function () {

    return gulp.src([
        'src/templates/**/*.jade',
        '!src/templates/**/_*.jade'
    ])
        .pipe(plumber())
        .pipe(jade({pretty: settings.debug}))
        .pipe(gulp.dest(settings.dest))
        .pipe(connect.reload());

});


gulp.task('styles', ['sprites'], function () {

    return gulp.src('src/styles/app.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
          .pipe(stylus({
              use: nib(),
              compress: true
          }))
          .pipe(prefix())
        .pipe(sourcemaps.write('.', {sourceRoot: '/src/styles'}))
        .pipe(gulp.dest(settings.dest+'/css'))
        .pipe(connect.reload());

});


gulp.task('scripts', function () {

    return gulp.src('src/scripts/**/*.coffee')
        .pipe(plumber())
        .pipe(newer(settings.dest+'/js/app.js'))
        .pipe(sourcemaps.init())
          .pipe(coffee())
          .pipe(concat('app.js'))
          .pipe(uglify())
        .pipe(sourcemaps.write('.', {sourceRoot: '/src/scripts'}))
        .pipe(gulp.dest(settings.dest+'/js'))
        .pipe(connect.reload());

});


gulp.task('images', function () {

    return gulp.src([
            'src/images/**/*',
            '!src/images/sprites',
            '!src/images/sprites/**/*',
            'src/vendor/img/**/*'
        ])
        .pipe(plumber())
        .pipe(newer(settings.dest+'/img'))
        .pipe(imagemin())
        .pipe(gulp.dest(settings.dest+'/img'));

});


gulp.task('sprites', function (cb) {

    glob('src/images/sprites/*', function (err, matches) {
        if (!matches.length) return cb();

        var streams = [];

        matches.forEach(function (path) {

            var spriteName = path.split('/').pop();
            var isRetina = false;
            var isBase64 = false;

            if (/@2x$/.test(spriteName)) {
                isRetina = true;
                spriteName = spriteName.replace(/@2x$/, '');
            }
            if (/-base64$/.test(spriteName)) {
                isBase64 = true;
                spriteName = spriteName.replace(/-base64$/, '');
            }

            var stream = gulp.src(path + '/*.png')
                .pipe(plumber())
                .pipe(newer(settings.dest+'/img'+spriteName+'.png'))
                .pipe(sprite({
                    name: spriteName + '-sprite',
                    base64: isBase64,
                    retina: isRetina,
                    style: spriteName + '-sprite.styl',
                    cssPath: '../img',
                    template: 'src/styles/sprites/template.mustache',
                    prefix: 'icon-' + spriteName
                }));

            streams.push(stream);

        });

        mergeStream.apply(null, streams)
            .pipe(
                gulpif('*.png',                      // if png
                    gulp.dest(settings.dest+'/img'), // then move to images
                    gulp.dest('src/styles/sprites')  // else move to stylesheets
                )
            )
            .on('data', function () {})
            .on('end', cb);

    });

});


gulp.task('fonts', function () {

    return gulp.src('src/fonts/**/*')
        .pipe(plumber())
        .pipe(newer(settings.dest+'/fonts'))
        .pipe(gulp.dest(settings.dest+'/fonts'));

});


gulp.task('vendor-css', function () {

    return gulp.src('src/vendor/css/**/*.css')
        .pipe(plumber())
        .pipe(newer(settings.dest+'/js/vendor.css'))
        .pipe(sourcemaps.init())
          .pipe(concat('vendor.css'))
          .pipe(minifyCSS())
        .pipe(sourcemaps.write('.', {sourceRoot: '/src/vendor/css'}))
        .pipe(gulp.dest(settings.dest+'/css'))
        .pipe(connect.reload());

});


gulp.task('vendor-js', function () {

    return gulp.src('src/vendor/js/**/*.js')
        .pipe(plumber())
        .pipe(newer(settings.dest+'/js/vendor.js'))
        .pipe(sourcemaps.init())
          .pipe(concat('vendor.js'))
          .pipe(uglify())
        .pipe(sourcemaps.write('.', {sourceRoot: '/src/vendor/js'}))
        .pipe(gulp.dest(settings.dest+'/js'))
        .pipe(connect.reload());

});


gulp.task('tmp', function () {

    return gulp.src('tmp/**/*')
        .pipe(gulp.dest(settings.dest+'/tmp'));

});


gulp.task('default', ['templates', 'styles', 'scripts', 'images', 'fonts', 'vendor-css', 'vendor-js', 'tmp'], function () {

    connect.server({
        root: settings.dest,
        livereload: true
    });

    gulp.watch(['src/templates' ,'src/templates/**/*.jade'], ['templates']);

    gulp.watch(['src/styles', 'src/styles/**/*.styl'], ['styles']);

    gulp.watch(['src/scripts', 'src/scripts/**/*.coffee'], ['scripts']);

    gulp.watch(['src/images', 'src/images/**/*', '!src/images/sprites', '!src/images/sprites/**/*', 'src/vendor/img/**/*'], ['images']);

    gulp.watch(['src/images/sprites', 'src/images/sprites/*', 'src/images/sprites/**/*.png'], ['sprites']);

    gulp.watch(['src/fonts', 'src/fonts/**/*'], ['fonts']);

    gulp.watch(['src/vendor/css', 'src/vendor/css/**/*.css'], ['vendor-css']);

    gulp.watch(['src/vendor/js', 'src/vendor/js/**/*.js'], ['vendor-js']);

    gulp.watch('tmp/**/*', ['tmp']);

});


gulp.task('prepare:build', function () {

    settings.debug = false;

    del.sync('build');

});


gulp.task('build', ['prepare:build', 'templates', 'styles', 'scripts', 'images', 'fonts', 'vendor-css', 'vendor-js', 'tmp']);
