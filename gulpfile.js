var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var imageMin = require('gulp-imagemin')


sass.compiler = require('node-sass');

gulp.task("sass", function () {
    return gulp.src("src/css/app.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe( cleanCSS({
            compatibility: 'ie8'
        }) 
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
});

gulp.task("fonts", function(){
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))
});

gulp.task("images", function(){
    return gulp.src("src/img/*")
        .pipe(imageMin())
        .pipe(gulp.dest("dist/img"))
});

gulp.task("html", function(){
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
});

gulp.task("watch", function(){

    browserSync.init({
        server: {
            baseDir: "dist" 
        }
    })

    gulp.watch("src/*.html", gulp.series("html")).on ("change",browserSync.reload)
    gulp.watch("src/css/app.scss", gulp.series("sass"))
    gulp.watch("src/fonts/*", gulp.series("fonts"))
    gulp.watch("src/img/*", gulp.series("images"))
});

gulp.task('default', gulp.series("html","sass", "fonts", "images", "watch"));