const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
			sass = require('gulp-sass'),
			babel = require('gulp-babel');

gulp.task('sass', () => {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => gulp.src('src/js/main.js')
  .pipe(babel({
      presets: ['@babel/env']
  }))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream())
);

gulp.task('default', (cb) => {
  browserSync.init({
      server: {
          baseDir: "."
      }
  });

  cb();

  gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/main.js', gulp.series('js'));
});