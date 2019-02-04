var gulp   = require('gulp');
var sass   = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src(["scss/**/*.scss"])
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())//Crea el min del css
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: true //false para verlo minificado el webkit
        }))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('javascript', function (cb) {
    pump([
      gulp.src('app/js/*.js'),
      uglify(),
      gulp.dest('app/js/min')
    ],
    cb
  );
});

//Poner mas de una tarea
//gulp.task('serve', gulp.series('sass', gulp.parallel('TASK1','TASK2'), function(done) {});

gulp.task('serve', gulp.series('sass', gulp.parallel('javascript'), function(done) {
  browserSync.init({
      server: './app',
      browser: "google chrome",
      notify: false
  });
  gulp.watch("app/js/*.js", gulp.series('javascript')).on('change', browserSync.reload);
  gulp.watch("scss/**/*.scss", gulp.series('sass'));
  gulp.watch("app/*.html").on('change', browserSync.reload);
  gulp.watch("html/*.html", gulp.series('minify_html'));
  done();
  }
));

gulp.task('minify_html', function() {
  return gulp.src('html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('app'));
});

gulp.task('optimize_img', () =>
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))
);


gulp.task('default', gulp.series('serve'));
