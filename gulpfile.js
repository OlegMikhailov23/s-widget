'use strict';

let gulp = require('gulp');

// работа со стилями

let sass = require('gulp-sass');
let plumber = require('gulp-plumber');
let postcss = require('gulp-postcss');
let ccscomb = require('gulp-csscomb');
let autoprefixer = require('autoprefixer');
let mqpacker = require('css-mqpacker');
let minify = require('gulp-csso');
let rename = require('gulp-rename');

let imagemin = require('gulp-imagemin');
let del = require('del');
let gulpCopy = require('gulp-copy');

let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');

let server = require('browser-sync').create()

// 1) таск компиляции css
gulp.task('style', async function () {
  gulp.src('source/sass/style.scss') // откуда берем файлы
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        overrideBrowserlist: ['last 15 version', '> 1%', 'ie 8', 'ie 7']
      }),
      mqpacker({
        sort: true
      }),
    ]))
    .pipe(ccscomb())
      .pipe(rename('widget.css'))
    .pipe(gulp.dest('source/css'))
    .pipe(minify())
    .pipe(rename('widget.min.css'))
    .pipe(gulp.dest('build/source/css')) // конечная директория в продакшн
    .pipe(server.stream());
});
// 2) таск для оптимизации изображений
gulp.task("images", async function () {
  return gulp.src("build/source/img/**/*.{png,jpg,gif,svg}") // откуда берем файлы
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest("build/source/img")); // помещаем в эту же папку
});

// 3) Собираем js библиотеки

gulp.task('jslibs', async function () {
  return gulp.src([
    // сюда вставляем через запятую пути до js библиотек, например: 'source/libs/jQuery-3.4.1-min.js'
    'source/libs/jQuery-3.4.1-min.js'
  ])
  .pipe(concat('libs.min.js')) // соединяем в один файл
  .pipe(uglify()) // минифицируем js
  .pipe(gulp.dest('build/source/libs')) // выгружаем в продакшн
});
// 4) собираем js файлы
gulp.task('minjs', async function () {
  return gulp.src([
    // сюда вставляем через запятую пути до js файлов, например: 'source/js/send-ajax.js'
    'source/js/widget.js'
  ])
    .pipe(concat('widget.min.js')) // соединяем в один файл
      .pipe(babel({
          presets: ['@babel/preset-env']
      }))
      .pipe(uglify({
        output: {
            comments: true
        }
    })) // минифицируем js
    .pipe(gulp.dest('build/source/js')) // выгружаем в продакшн
});

// 5) запускаем live-server
gulp.task('serve', async function () {
  server.init({
    server: 'build/source',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', gulp.parallel('style'));
  gulp.watch('source/*.html', gulp.parallel('gulpCopy')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.parallel('minjs')).on('change', server.reload);
  gulp.watch('source/libs/**/*.js', gulp.parallel('jslibs')).on('change', server.reload);
  gulp.watch('source/img/**/*.{png,jpg,gif,svg}', gulp.series('clean', 'copy', 'style', 'images', 'minjs', 'jslibs')).on('change', server.reload);
})
// 6) таск для строки 111
gulp.task('gulpCopy', async function () {
  return gulp.src([
    'source/*html'
  ], {
    base: '.'
  })
  .pipe(gulp.dest('build'));
});
// 7) копируем необходимые файлы в продакшн
gulp.task('copy', function async () {
  return gulp.src([
          "source/js/widget-settings.js",
          "source/libs/jQuery-3.4.1-min.js",
          "source/fonts/**/*.{woff,woff2,ttf}",
          "source/img/**",
          "source/*html",
          "source/*php",
          "source/favicon.png",
          "source/*pdf",
          "source/css/reboot.css",
  ], {
    base: '.'
  })
  .pipe(gulp.dest('build'));
});
// 8) стираем build после любого изменений, чтобы сборщик работал с пустой папкой
gulp.task('clean', async function () {
  return del('build');
});
// 9 - запускаем процесс сборки в необходимой последовательности
gulp.task('build', gulp.series('clean', 'copy', 'style', 'images', 'minjs', 'jslibs'));



