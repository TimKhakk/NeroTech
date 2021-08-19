const { src, dest, watch, series, parallel } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); // Объединитель. Также может переименовывать
const sync = require('browser-sync').create();

// #region HTML
const html = () =>
	src('src/*.html')
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: true,
			})
		)
		.pipe(concat('index.html'))
		.pipe(dest('dist')) // Пункт назначения
		.pipe(sync.stream()); // Обновление страницы

exports.html = html;

// #endregion

// #region Styles

const styles = () =>
	src('src/styles/**/*.scss') // Важно! Сначала объединяем, затем компрессуем
		.pipe(concat('index.min.css')) // Объединяет и переименовывает конечный файл
		.pipe(sass())
		.pipe(autoprefixer({ browsersList: 'last 2 versions' }))
		.pipe(csso())
		.pipe(dest('dist/styles')) // Пункт назначения
		.pipe(sync.stream()); // Обновление страницы

exports.styles = styles;

// #endregion

// #region Server

const serve = () => {
	sync.init({
		ui: false,
		server: {
			baseDir: 'dist',
		},
	});
};

exports.serve = serve;

// #endregion

// #region Watcher

const watchAll = () => {
	watch(['src/index.html', 'src/**/*.scss'], series(html, styles));
};

exports.watchAll = watchAll;

// #endregion

// Default

exports.default = series(parallel(html, styles), parallel(watchAll, serve));
