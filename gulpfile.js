const isDevelopment = true;


const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const browserSync = require('browser-sync').create();
// const uglify = require('gulp-uglify');
const uglifyEs = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const beep = require('beepbeep');
const notify = require('gulp-notify');
const jshint = require('gulp-jshint');
var htmlhint = require("gulp-htmlhint");
const babel = require('gulp-babel');
const autopolyfiller = require('gulp-autopolyfiller');
const csso = require('gulp-csso');
const cleanCss = require('gulp-clean-css');
const uncss = require('gulp-uncss');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');



var onError = function (err) {
    notify.onError({
        title: "Error in " + err.plugin,
        message: err.message
    })(err);
    beep(5);
    this.emit('end');
};



// подключение плагина SASS
gulp.task('scss', () => {
    return gulp.src('src/scss/main.scss') //'src/scss/**/*.scss'
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(debug({ title: 'sourcemaps' }))
        .pipe(sass())
        .pipe(debug({ title: 'sass' }))
        .pipe(gcmq())
        .pipe(debug({ title: 'group metaqueries' }))
        .pipe(gulpIf(!isDevelopment, csso()))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'csso -> production' })))
        .pipe(gulpIf(!isDevelopment, autoprefixer({ browsers: ['last 3 versions'] })))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'autoprefixer -> production' })))
        .pipe(concat('bundle.css'))
        .pipe(debug({ title: 'concat' }))
        .pipe(gulp.dest('dist/css')) 
        // .pipe(gulpIf(!isDevelopment, uncss({ html: ['dist/*.html'], ignore: ['placeholder'] })))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'uncss -> production' })))
        .pipe(gulpIf(!isDevelopment, cleanCss()))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'cleanCss -> production' })))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(debug({ title: 'sourcemaps' }))
        .pipe(rename('bundle.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(debug({ title: 'dest' }))
        .pipe(gulpIf(isDevelopment, notify('SCSS OK!')))
        .pipe(gulpIf(!isDevelopment, notify('SCSS --- production --- OK!')))
        .pipe(browserSync.stream())
});


gulp.task('watch:scss', () => {
    gulp.watch('src/scss/**/*.scss', ['scss']) // gulp.watch('src/scss/**/*.scss', ['scss'])
});

// *********************************** 
gulp.task('js:plus', () => {

    // return gulp.src('src/js/**/*.js')
    return gulp.src(['dist/js/polyfill.js', 'dist/js/bundle.js'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(debug({ title: 'JS - plumber' }))
        .pipe(concat('bundle-polyfill.js'))
        .pipe(debug({ title: 'JS - concat' }))
        .pipe(jshint())
        .pipe(debug({ title: 'JS - jshinty' }))
        .pipe(jshint.reporter('jshint-stylish', { beep: true }))
        // .pipe(gulpIf(!isDevelopment, uglify()))
        .pipe(gulpIf(isDevelopment, notify('js:plus OK!')))
        .pipe(gulpIf(!isDevelopment, notify('js:plus --- production --- OK!')))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('js:polyfil', () => {
    return gulp.src('src/js/**/*.js')
    .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('all.js'))
        // .pipe(babel())
        .pipe(babel())
        // .pipe(uglify())
        // .pipe(autopolyfiller('all.js'))
        // .pipe(gulpIf(isDevelopment, notify('js:polyfil OK!')))
        // .pipe(gulpIf(!isDevelopment, notify('js:polyfil --- production --- OK!')))
        .pipe(gulp.dest('dist/js'));
});



gulp.task('js:bundle', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(debug({ title: 'js:bundle - plumber' }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'))///////
        .pipe(gulpIf(!isDevelopment, uglifyEs()))
        .pipe(debug({ title: 'js:bundle - concat' }))
        .pipe(gulpIf(isDevelopment, notify('js:bundle OK!')))
        .pipe(gulpIf(!isDevelopment, notify('js:bundle --- production --- OK!')))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});


gulp.task('watch:js', () => {
    if (isDevelopment) {
        gulp.watch('src/js/**/*.js', ['js:bundle']);
    }
    if (!isDevelopment) {
        gulp.watch('src/js/**/*.js', ['js:polyfil', 'js:bundle']);
        gulp.watch('dist/js/**/*.js', ['js:plus']);
    }


});


// ********************************

gulp.task('imagemin', () => {
    return gulp.src('src/img/**/*.{png,jpg,jpeg,gif}')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer('dist/img'))
        .pipe(debug({ title: 'IMG - newer' }))
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true})
        ]))
        .pipe(debug({ title: 'IMG - imagemin' }))
        .pipe(gulp.dest('dist/img'))
        .pipe(debug({ title: 'IMG - dest' }))
        .pipe(gulpIf(isDevelopment, notify('IMG OK!')))
        .pipe(browserSync.stream())
});

gulp.task('watch:imagemin', () => {
    gulp.watch('src/img/**', ['imagemin'])
});

// ********************************

gulp.task('svg', () => {
    return gulp.src('src/img/svg/*.svg')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(svgmin())
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('dist/img/icons'))
        .pipe(debug({ title: 'SVG - dest' }))
        .pipe(gulpIf(isDevelopment, notify('SVG OK!')))
});

// ********************************
gulp.task('htmlmin', () => {
    return gulp.src('src/**/*.html')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter("htmlhint-stylish"))
        .pipe(debug({ title: 'htmlhint' }))
        .pipe(gulpIf(!isDevelopment, htmlmin(
            {
                removeComments: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                removeEmptyElements: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            }
        )))
        .pipe(debug({ title: 'htmlmin' }))
        .pipe(gulp.dest('dist'))
        .pipe(debug({ title: 'dest' }))
        .pipe(gulpIf(isDevelopment, notify('HTML OK!')))
        .pipe(gulpIf(!isDevelopment, notify('HTML --- production --- OK!')))
        .pipe(browserSync.stream())
});

gulp.task('watch:htmlmin', () => {
    gulp.watch('src/**/*.html', ['htmlmin'])
});

// ********************************

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

// ********************************
// gulp.task('build', () => {
//    run('htmlmin', 'imagemin')
// });


// подключение задач в дефолтные
gulp.task('default', ['watch:htmlmin', 'watch:scss', 'watch:js', 'watch:imagemin', 'serve']);




// var cssMin = function() {
//     return gulp.src(paths.css)
//                 .pipe(cssmin())
//                 .pipe(rename({suffix: '.min'}))
//                 .pipe(gulp.dest(srcPath + '/css'));
// };

// gulp.task('sass-compile', function() {
//     gulp.src(paths.sass)
//         .pipe(sass())
//         .pipe(gulp.dest(srcPath + '/css'))
//         .on('end', function(){
//             cssMin();
//         });
// });

// тут присутствует метод .on('end', fn). Простыми словами, когда сработает событие end 
// (создастся css файл) вызываем функцию cssMin(), которая создаст минифицированный css файл.


// ./ - текущая директория;
// ../ - родительская директория;
// js/index.js - файл index.js в папке js;
// js/*.js - все файлы с расширением js в папке js;
// js/**/*.js - все файлы с расширением js в папке js и в ее подкаталогах;
// !js/*.js - исключение файлов с расширением js в папке js.