const isDevelopment = true;


const gulp = require('gulp');
// подключение плагина SASS 
const sass = require('gulp-sass');
// подключение плагина concat 
const concat = require('gulp-concat');
// подключение плагина sourcemaps 
const sourcemaps = require('gulp-sourcemaps');
// подключение плагина gulp-if  
const gulpIf = require('gulp-if');
// подключение плагина debug 
const debug = require('gulp-debug');
// подключение плагина browser-sync 
const browserSync = require('browser-sync').create();

// сам доставил
// // подключение плагина gulp-uglify es - минификатор JavaScript
// const uglifyEs = require('gulp-uglify-es').default;
// подключение плагина gulp-uglify  - минификатор JavaScript
const uglify = require('gulp-uglify');
// подключение плагина gulp-imagemin  - минификатор IMG
const imagemin = require('gulp-imagemin');
// подключение плагина gulp-htmlmin  - html минификатор
const htmlmin = require('gulp-htmlmin');
// подключение плагина gulp-newer  - изменяет только новые
const newer = require('gulp-newer');
// подключение плагина gulp-plumber  - что бы не было прерывания потока
const plumber = require('gulp-plumber');
// подключение плагина beepbeep  - звук
const beep = require('beepbeep');
// подключение плагина gulp-notify  - выдавать сообщения об ошибках в CSS
const notify = require('gulp-notify');
// подключение плагина gulp-jshint  - выдавать сообщения об ошибках в JS
const jshint = require('gulp-jshint');
// подключение плагина gulp-htmlhint  - HTML валидатор
var htmlhint = require("gulp-htmlhint");
// подключение плагина gulp-babel
const babel = require('gulp-babel');
// подключение плагина gulp-autopolyfiller
const autopolyfiller = require('gulp-autopolyfiller');


// подключение плагина gulp-csso  (делает margin: 10 20 30 40;)
const csso = require('gulp-csso');
// подключение плагина gulp-clean-css  
const cleanCss = require('gulp-clean-css');
// подключение плагина gulp-uncss  - убирает неиспользованный CSS
const uncss = require('gulp-uncss');
// подключение плагина autoprefixer 
const autoprefixer = require('gulp-autoprefixer');
// подключение плагина media queries
const gcmq = require('gulp-group-css-media-queries');


//3
// npm i --save-dev gulp-sass   
// npm i --save-dev gulp-concat 
// npm i --save-dev gulp-sourcemaps 
// npm i --save-dev gulp-autoprefixer 

//4
// npm i --save-dev gulp-clean-css 
// npm i --save-dev gulp-if 
// npm i --save-dev gulp-debug 

//6
//npm i browser-sync --save-dev

// мои
// npm install gulp-csso --save-dev
// npm i --save-dev gulp-uglify
// npm i --save-dev gulp-uglify-es
// npm i --save-dev gulp-imagemin
// npm i --save-dev gulp-htmlmin
// npm i --save-dev gulp-newer
// npm i --save-dev gulp-uncss
// npm i --save-dev gulp-plumber
// npm i --save-dev beepbeep ????????????????????????? 
// npm i --save-dev gulp-notify
// npm install --save-dev jshint gulp-jshint
// npm install --save-dev jshint-stylish 
// npm install --save-dev gulp-htmlhint
// npm i --save-dev htmlhint-stylish
//  npm install --save-dev gulp-babel@7 babel-core babel-preset-env
// npm install --save-dev gulp-autopolyfiller
// npm install --save-dev gulp-group-css-media-queries



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
        .pipe(gulpIf(!isDevelopment, uncss({ html: ['dist/*.html'], ignore: ['placeholder'] })))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'uncss -> production' })))
        .pipe(gulpIf(!isDevelopment, cleanCss()))
        .pipe(gulpIf(!isDevelopment, debug({ title: 'cleanCss -> production' })))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(debug({ title: 'sourcemaps' }))
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
        .pipe(concat('all.js'))
        .pipe(babel())
        .pipe(autopolyfiller('polyfill.js'))
        .pipe(gulpIf(isDevelopment, notify('js:polyfil OK!')))
        .pipe(gulpIf(!isDevelopment, notify('js:polyfil --- production --- OK!')))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js:bundle', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(debug({ title: 'js:bundle - plumber' }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(concat('bundle.js'))
        .pipe(debug({ title: 'js:bundle - concat' }))
        .pipe(gulpIf(isDevelopment, notify('js:bundle OK!')))
        .pipe(gulpIf(!isDevelopment, notify('js:bundle --- production --- OK!')))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('dist/js'));
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
    return gulp.src('src/img/**/*.{png,jpg,jpeg,gif,svg}')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer('dist/img'))
        .pipe(debug({ title: 'IMG - newer' }))
        .pipe(imagemin())
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
                // removeEmptyElements: true,
                // removeEmptyAttributes: true
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



// подключение задач в дефолтные
gulp.task('default', ['watch:htmlmin', 'watch:scss', 'watch:js', 'watch:imagemin', 'serve']);
