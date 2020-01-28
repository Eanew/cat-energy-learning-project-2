"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const sprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const csso = require("gulp-csso");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const babel = require("gulp-babel");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("imagemin", () =>
  gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest("build/img"))
);

gulp.task("webp", () =>
  gulp.src("source/img/**.{jpg,png}")
    .pipe(webp({quality: 90}))
      .pipe(gulp.dest("build/img"))
);

gulp.task("sprite-svg", () => {
  return gulp
    .src("source/sprite-svg/*.svg")
    .pipe(
      sprite({
        svg: {
          doctypeDeclaration: false,
          xmlDeclaration: false
        },
        shape: {
          dimension: {
            maxWidth: 32,
            maxHeight: 32
          },
          transform: [
            {
              svgo: {
                plugins: [
                  { transformsWithOnePath: true },
                  { moveGroupAttrsToElems: false }
                ]
              }
            }
          ]
        },
        mode: {
          symbol: {
            bust: false,
            dest: "."
          }
        }
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("babel", () =>
  gulp.src("source/js/*.js")
    .pipe(babel({
      presets: ["@babel/env"]
    }))
    .pipe(gulp.dest("build/js"))
);

gulp.task("script", () => {
  return gulp
    .src(["node_modules/svg4everybody/dist/svg4everybody.min.js", "source/js/babelignore/*.js"])
    .pipe(gulp.dest("build/js"))
})

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    // "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
})

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/**/*.js", gulp.series("babel", "script", "refresh"));
  gulp.watch("source/sprite-svg/**", gulp.series("sprite-svg", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "imagemin",
  "webp",
  "babel",
  "script",
  "css",
  "sprite-svg",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
