const gulp = require('gulp'); // npm i -g gulp-cli
const sass = require('gulp-sass');//
const concat = require('gulp-concat');//
const sourcemaps = require('gulp-sourcemaps');//
const browserSync = require('browser-sync').create();//
const plumber = require('gulp-plumber');
const beep = require('beepbeep');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const debug = require('gulp-debug');
const fileinclude = require('gulp-file-include');// @@include('html/111.html')
const del = require('del');
const jshint = require('gulp-jshint');
const newer = require('gulp-newer');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const htmlhint = require("gulp-htmlhint");
// -------------------------------------
const htmlmin = require('gulp-htmlmin');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
//-------------------------------------
const deploy = require('gulp-gh-pages');


// const uglifyEs = require('gulp-uglify-es').default;

// const gulpIf = require('gulp-if');




// const autopolyfiller = require('gulp-autopolyfiller');
// const cleanCss = require('gulp-clean-css');
// const uncss = require('gulp-uncss');



const PATHOUT = 'dist';
const PATHIN = 'src';

var onError = function (err) {
    notify.onError({
        title: "Error in " + err.plugin,
        message: err.message
    })(err);
    beep(5);
    this.emit('end');
};

// fileinclude
gulp.task('fileinclude', function () {
    return gulp.src([PATHIN + '/index.html'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(debug({ title: 'fileinclude' }))
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter("htmlhint-stylish"))
        .pipe(debug({ title: 'htmlhint' }))
        .pipe(gulp.dest(PATHOUT))
        .pipe(notify('fileinclude OK!'))
        .pipe(browserSync.stream());
    // fn();
});

gulp.task('watch:fileinclude', function () {
    gulp.watch([PATHIN + '/index.html', PATHIN + '/html/**/*.html'], gulp.series('fileinclude'));
});

// подключение плагина SASS
gulp.task('scss', function () {
    return gulp.src([PATHIN + '/scss/main.scss'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(debug({ title: 'sourcemaps' }))
        .pipe(sass())
        .pipe(debug({ title: 'sass' }))
        .pipe(concat('bundle.css'))
        .pipe(debug({ title: 'concat' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHOUT + '/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATHOUT + '/css'))
        .pipe(notify('SCSS OK!'))
        .pipe(browserSync.stream())
});


gulp.task('watch:scss', function () {
    gulp.watch(PATHIN + '/scss/**/*.scss', gulp.series('scss'))
});

// *********************************** 
gulp.task('js', function () {
    return gulp.src([PATHIN + '/js/moduls/*.js'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(debug({ title: 'JS - plumber' }))
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(debug({ title: 'JS - jshinty' }))
        .pipe(concat('bundle.js'))
        .pipe(debug({ title: 'JS - concat' }))


        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHOUT + '/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATHOUT + '/js'))
        .pipe(notify('JS OK!'))
        .pipe(browserSync.stream());

});

gulp.task('watch:js', function () {
    gulp.watch(PATHIN + '/js/moduls/*.js', gulp.series('js'))
});

// *********************************** 


// ********************************




// ********************************



// ********************************



// @
// @++++++++++++++++++++++++++++++ BUILD +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @





// ********************************



// ********************************



// ********************************



// *********************************** 



// *********************************** 




// ********************************




//  https://frontender.info/task_automation_with_npm_run/ - про package.json


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