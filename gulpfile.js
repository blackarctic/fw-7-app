var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var jslint = require('gulp-jslint');
var clean = require('gulp-clean');
var gcallback = require('gulp-callback');


var prep = function () {
	
	// prep res
	gulp.src('src/res/**/*')
	.pipe(gulp.dest('dist/res'));

	// prep .html files
	gulp.src('src/*.html')
	.pipe(gulp.dest('dist'));

	// prep .scss files
	gulp.src('src/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest('dist'));

	// prep .js files
	gulp.src('src/*.js')
	.pipe(jslint())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('dist'));
};


var initial = function () {

	var copy_external_libs = function () {
		// prep external libraries (uncomment to copy all libraries over)
		gulp.src('node_modules/**/*')
		.pipe(gulp.dest('dist/lib'));
	};
	
	// clean out old dist folder
	gulp.src('dist', {read: false})
	.pipe(clean({force: true}))
	.pipe(gcallback(function () {
		copy_external_libs();
		prep();
	}));
};


gulp.task('connect', function() {
	initial()
	connect.server({
		root: 'dist',
		livereload: true
	});
});

gulp.task('change', function () {
	prep();
	gulp.src('./dist/*')
	.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['./src/*'], ['change']);
});

gulp.task('default', ['connect', 'watch']);