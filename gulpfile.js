var gulp = require('gulp')
var sass = require('gulp-sass')
var ts = require('gulp-typescript')



var browserSync = require('browser-sync').create()

gulp.task('sass', () => {
  return gulp.src('docs/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('ts', () => {
  return gulp.src('docs/ts/*.ts')
    .pipe(ts({
      target: 'ES6',
      outFile: 'main.js'
    }))
    .pipe(gulp.dest('docs/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', gulp.series('sass', 'ts', () => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    },
  })

  gulp.watch('docs/scss/*.scss').on('change', gulp.series('sass'))
  gulp.watch('docs/ts/*.ts').on('change', gulp.series('ts'))
  gulp.watch(['docs/*.html']).on('change', browserSync.reload)
}));


gulp.task('default', gulp.series('watch'))