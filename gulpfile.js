var gulp = require('gulp')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var gulpIf = require('gulp-if')
var cssnano = require('gulp-cssnano')

var browserSync = require('browser-sync').create()

gulp.task('sass', () => {
  return gulp.src('docs/scss/main.scss')
  .pipe(sass())
  .pipe(gulp.dest('docs/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('watch', gulp.series('sass', () => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    },
  })

  gulp.watch('docs/scss/*.scss').on('change', gulp.series('sass'))
  gulp.watch('docs/js/*.js').on('change', browserSync.reload)
  gulp.watch('docs/*.html').on('change', browserSync.reload) 
}));


gulp.task('default', gulp.series('watch'))