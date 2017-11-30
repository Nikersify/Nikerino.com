const fs = require('fs')

const babelify = require('babelify')
const browserify = require('browserify')
const cleanCSS = require('gulp-clean-css')
const del = require('del')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const streamify = require('gulp-streamify')
const uglify = require('gulp-uglify')

gulp.task('js', () => {
	return browserify('./app/js/index.js')
		.transform(babelify, {
			presets: [['env', {
				targets: {
					browsers: ['last 2 versions', 'safari >= 7']
				}
			}]]
		})
		.bundle()
		.on('error', function (e) {
			console.log(e.message)
			this.emit('end')
		})
		.pipe(source('index.js'))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest('public/'))
})

gulp.task('pug', done => {
	return gulp.src('app/pug/index.pug')
		.pipe(pug().on('error', err => {
			done(err.message)
		}))
		.pipe(htmlmin())
		.pipe(gulp.dest('public'))
})

gulp.task('assets', async () => {
	await del('public/assets')
	return gulp.src('app/assets/**/*')
		.pipe(gulp.dest('public/assets'))
})

gulp.task('sass', () => {
	return gulp.src('app/sass/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS())
		.pipe(gulp.dest('public'))
})

gulp.task('watch', () => {
	gulp.watch('app/js/**/*', ['js'])
	gulp.watch('app/pug/**/*', ['pug'])
	gulp.watch('app/assets/**/*', ['assets'])
	gulp.watch('app/sass/**/*', ['sass'])
})

gulp.task('default:prep', () => {
	if (!fs.existsSync('public')) {
		fs.mkdirSync('public')
	}
})

gulp.task('default', ['default:prep', 'js', 'pug', 'assets', 'sass'])
