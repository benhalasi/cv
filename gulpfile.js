const gulp = require('gulp');
const sass = require('gulp-sass')
var uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tsify = require('tsify');

const src = 'src/'
const dist = 'docs/'

const browserSync = require('browser-sync').create()

const staticResourcePaths = [
  { from: src + '*.html', to: dist },
  { from: src + 'misc/*', to: dist + 'misc' },
  { from: src + 'imgs/*', to: dist + 'imgs' }
];

staticResourcePaths.forEach(res =>
  gulp.task(res.from, () =>
    gulp.src(res.from)
      .pipe(gulp.dest(res.to))
      .pipe(browserSync.reload({
        stream: true
      }))
  )

)

gulp.task('statics', gulp.parallel(
  staticResourcePaths.map(res => res.from)
))

gulp.task('jquery', () =>
  gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

// popper.js is included in bootstrap.bundle(.min.js)
// we copy *.map too, it's useful for debugging.
gulp.task('bootstrap', () =>
  gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map'])
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
);

gulp.task('sass', () =>
  gulp.src(src + 'scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest(dist + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
);

gulp.task('ts', () =>
  browserify({
    basedir: '.',
    debug: true,
    entries: [src + 'ts/main.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

gulp.task('js', () =>
  gulp.src(src + 'js/*.js')
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

gulp.task('build', gulp.parallel(
  'statics',
  'bootstrap',
  'jquery',
  'sass',
  'ts',
  'js'
))

gulp.task('watch', gulp.series('build', () => {
  browserSync.init({
    server: {
      baseDir: dist
    },
  })

  gulp.watch(src + 'scss/*.scss').on('change', gulp.task('sass'))
  gulp.watch(src + 'ts/*.ts').on('change', gulp.task('ts'))
  staticResourcePaths.forEach(res =>
    gulp.watch(res.from).on('change', gulp.task(res.from))
  )
}))

gulp.task('default', gulp.series('watch'))