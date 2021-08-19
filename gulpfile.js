const { src, dest, watch, series, parallel } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); // Объединитель. Также может переименовывать
const sync = require('browser-sync').create();

// HTML

const html = () =>
	src('src/*.html')
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: true,
			})
		)
		.pipe(concat('index.html'))
		.pipe(dest('dist'))
		.pipe(sync.stream()); // Обновление страницы

exports.html = html;

// Styles

const styles = () =>
	src(['src/styles/required/*scss', 'src/styles/*.scss']) // Важно! Сначала берем файлы из папки required объединяем, затем компрессуем
		.pipe(concat('index.min.css')) // Объединяет и переименовывает конечный файл
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({ browsersList: 'last 2 versions' }))
		.pipe(csso())
		.pipe(dest('dist/styles'))
		.pipe(sync.stream()); // Обновление страницы

exports.styles = styles;

// Server

const serve = () => {
	sync.init({
		ui: false,
		server: {
			baseDir: 'dist',
		},
	});
};

exports.serve = serve;

// Watcher

const watchAll = () => {
	watch(['src/index.html', 'src/**/*.scss'], series(html, styles));
};

exports.watchAll = watchAll;

// Default

exports.default = series(parallel(html, styles), parallel(watchAll, serve));
