var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
gulp.task('sass', function() {
    return gulp.src(["scss/**/*.scss"])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});
gulp.task("serve", gulp.parallel(['sass'], function(done) {
    browserSync.init({
        server: './app',
        browser: "google chrome",
        notify: false
    });
    gulp.watch("scss/**/*.scss", gulp.series('sass'));
    gulp.watch("app/*.html").on('change', browserSync.reload);
    done();
  })
);﻿
gulp.task('default', gulp.series('serve'));
