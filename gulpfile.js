// Lesson04 Vid03 – T 08:23 "gulp" wird als Variable angelegt und zieht sich den installierten "gulp"-code aus "package.json"
var gulp = require('gulp');
// Lesson04 Vid05 – T 04:17 "sass" als Variable - zieht "gulp-sass"-code aus "package.json"
// Lesson05 Vid02 – T 01:33 we remove "sass" T_T
// var sass = require('gulp-sass');
// Lesson04 Vid08 – T 02:56 "cleanCss" als Variable - zieht "gulp-clean-css"-code aus "package.json"
var cleanCSS = require('gulp-clean-css');
// VLesson04 id09 – T 06:49 "sourcemaps" als Variable - zieht "gulp-sourcemaps"-code aus "package.json"
var sourcemaps = require('gulp-sourcemaps');
// Lesson04 Vid10 – T 02:33 "browserSync" als Variable - zieht "browser-sync"-code aus "package.json" und ".create" erstellt einen "Server"
var browserSync = require('browser-sync').create();
// Lesson04 Vid13 – T 02:05 "imageMin" als Variable - zieht "gulp-imagemin"-code aus "package.json"
var imageMin = require('gulp-imagemin')
// Lesson04 Vid14 – T 06:53 "ghPages" als Variable - zieht "gh-pages"-code aus "package.json"
var ghPages = require('gh-pages')
// Lesson05 Vid02 – T 04:12 "postCSS" als Variable - zieht "gulp-postcss"-code aus "package.json"
var postCSS = require('gulp-postcss')
// Lesson05 Vid03 – T 04:14 "concat" als Variable - zieht "gulp-concat"-code aus "package.json"
var concat = require('gulp-concat')

// Lesson04 Vid05 – T 04:41 "sass" benötigt einen eigenen "Compiler"
// Lesson05 Vid02 – T 01:33 we remove "sass" T_T
// sass.compiler = require('node-sass');

// Lesson04 Vid05 – T 04:53 wir wollen das, was wir füher mit "sass" im Terminal ausgeführt haben (sass css/app.scss app.css) mit "gulp" automatisieren (später kommt noch die --watch-Funktion dazu)
// Lesson05 Vid02 – T 01:33 we remove "sass" and change it to "css"
gulp.task("css", function () {
    // Lesson05 Vid03 – T 01:59 nimmt die Dateien "app.css", "reset.css" und "typography.css" aus dem angegebenen Verzeichnis/Quelle/Source 
    return gulp.src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/app.css"
    ])
    // Lesson04 Vid09 – T 07:45 "sourcmaps" wird gestartet und merkt sich alle Zeilennummern und Umbrüche.
    .pipe(sourcemaps.init())
    // Lesson04 Vid05 – T 06:51 die Datei "app.scss" wird an "sass" weitergereicht "sass" wird ausgeführt und die Datei "app.css" wird erstellt
    // Lesson05 Vid02 – T 01:33 we remove "sass" T_T
    // .pipe(sass())
    // Lesson05 Vid02 – T 04:31 die Dateien "app.css", "reset.css" und "typography.css" werden an "postCSS" weitergereicht, die beiden Plugins "autoprefixer" und "postcss-preset-env" werden geladen und ausgeführt.
    .pipe (
        postCSS([
            require("autoprefixer"),
            require("postcss-preset-env")({
                stage: 1,
                browsers: ["IE 11", "last 2 versions"] 
            })
        ])
    )
    // Lesson05 Vid03 – T 05:325 die Dateien "app.css", "reset.css" und "typography.css" werden zu einer Datei "app.css" zusammengefügt
    .pipe(concat("app.css"))
    // Lesson04 Vid08 – T 03:45 Nachdem die Datei "app.css" erstellt wurde, löscht "cleanCss" alle Leerzeichen und Umbrüche, sodass alles in einer Zeile steht (Performanceoptimierung).
    .pipe( cleanCSS({
            compatibility: 'ie8'
        }) 
    )
    // Lesson04 Vid09 – T 07:45 nachdem alle Umbrüche beseitigt wurden, lässt sich der Code schlecht debuggen "sourcmaps" dokumentiert (in Zeile 02 von "app.css" alle geänderten Zeilennummern und Umbrüche, sodass man sie in den "developer-tools" sieht.
    .pipe(sourcemaps.write())
    // Lesson04 Vid05 – T 06:55 "gulp.dest" legt die Datei app.css im angegenen Ordner/Verzeichnis/Destination ab
    .pipe(gulp.dest("dist"))
    // Lesson04 Vid10 – T 05:31 "browserSync" ruft die veränderte "Website" im eigens erstellten "Server" auf, sodass man sofort die Veränderungen sehen kann.
    .pipe(browserSync.stream())
});

gulp.task("fonts", function(){
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"))
});

gulp.task("images", function(){
    return gulp.src("src/img/*")
    // Lesson04 Vid13 – T 02:52 "imageMin" reduziert die Größe der Bilder.
        .pipe(imageMin())
        .pipe(gulp.dest("dist/img"))
});

gulp.task("html", function(){
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
});

// Lesson04 Vid07 – T 00:51 (jetzt kommt noch die --watch-Funktion dazu) "gulp.watch" schaut nach Veränderungen in den angegebenen Dateien und führt dann die angegebenen "tasks" aus
gulp.task("watch", function(){
// Lesson04 Vid10 – T 03:59 der "Server" von "browserSync" wird initialisiert und das Verzeichnis, auf der die "Website"-Dateien sind, wird angegeben
    browserSync.init({
        server: {
            baseDir: "dist" 
        }
    })

    gulp.watch("src/*.html", gulp.series("html")).on ("change",browserSync.reload)
    // Lesson05 Vid02 – T 01:33 we remove "sass" and change it to "css"
    gulp.watch("src/css/*", gulp.series("css"))
    gulp.watch("src/fonts/*", gulp.series("fonts"))
    gulp.watch("src/img/*", gulp.series("images"))
});

// Lesson04 Vid14 – T 07:30 "ghPages" verpackt das Webseiten-projekt für "git-hub", damit das richtige Verzeichnis aufgerufen wird. (sonst sucht git-hub die "index.html" auf der "branch")
gulp.task('deploy', function(){
    ghPages.publish("dist")
})

// Lesson04 Vid03 – T 08:23 "gulp.task"('default') ist die "Hauptfunktion" von gulp wenn man im Terminal "gulp" eingibt werden die "tasks" ausgeführt, die hier hinterlegt sind.
gulp.task('default', gulp.series("html", "fonts","css", "images", "watch"));