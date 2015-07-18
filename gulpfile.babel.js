// PLUGINS

import gulp from 'gulp';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import uglify from 'gulp-uglify';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import minifyCSS from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import babelify from 'babelify';
import browserify from 'browserify';
import stylish from 'jshint-stylish';
import jshint from 'gulp-jshint';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';

// SHARED VARIABLES

let distFolder = './dist',
    srcViewFiles = '**/*.html',
    styleEntryPoint = 'src/main.scss',
    srcStyleFiles = 'src/**/*.scss',
    scriptEntryPoint = 'src/main.js',
    srcScriptFiles = 'src/**/*.js',
    scriptTestFiles = 'src/**/*-test.js',
    errorHandler = function(error) {
        util.beep();
        util.log(util.colors.red(`ERROR: ${error.message}`));
        this.emit('end');
    };

// TASKS

gulp.task('default', ['build']);
gulp.task('build', ['styles', 'scripts']);
gulp.task('serve', ['build', 'browser-sync', 'watch']);
gulp.task('lint', ['lintScripts']);
gulp.task('test', ['testScripts']);

gulp.task('styles', function () {
	let cssFilter = filter(['**/**/*.css']);
	return gulp.src(styleEntryPoint)
        .pipe(plumber({errorHandler: errorHandler}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass())
		.pipe(rename('all.min.css'))
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distFolder))
		.pipe(cssFilter)
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('lintScripts', () => {
	return gulp.src(srcScriptFiles)
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish));
});

gulp.task('testScripts', () => {
	return gulp.src(scriptTestFiles)
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('scripts', ['lintScripts', 'testScripts'], () => {
	let b = browserify({
	    entries: scriptEntryPoint,
	    debug: true
	})
	.transform(babelify);
	return b.bundle()
        .on('error', errorHandler)
		.pipe(plumber({errorHandler: errorHandler}))
	    .pipe(source('bundle.js'))
	    .pipe(buffer())
	    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distFolder));
});

gulp.task('browser-sync', ['default'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        },
        open: false,
        notify: false
    });
});

gulp.task('watch', () => {
    gulp.watch(srcViewFiles, [browserSync.reload]);
    gulp.watch(srcStyleFiles, ['styles']);
    gulp.watch(srcScriptFiles, ['scripts', browserSync.reload]);
});
