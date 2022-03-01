const gulp = require("gulp");

gulp.task("copyFile", function() {
    return gulp.src("./public/vedio/**/*.mp4")
        .pipe(gulp.dest("./styleguide/public/vedio/"));
});

gulp.task("copyFileJson", function() {
    return gulp.src("./public/json/**/*.json")
        .pipe(gulp.dest("./styleguide/public/json/"));
});

gulp.task("copyAll", gulp.series(gulp.parallel(["copyFile", "copyFileJson"])));