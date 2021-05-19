const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const imagemin = require("gulp-imagemin");
const minify = require("gulp-minify");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const minifyCss = require("gulp-clean-css");
const cssconcat = require("gulp-concat-css");
const postcss = require("gulp-postcss");
const project_folder = "dist";
const source_folder = "src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/script/",
    img: project_folder + "/",
  },
  src: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/**/*.css",
    js: source_folder + "/**/*.js",
    img: source_folder + "/**/*.{jpeg,png,jpg,svg,gif,ico,webp}",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/**/*.css",
    js: source_folder + "/**/*.js",
    img: source_folder + "/**/*.{jpeg,jpg,png,svg,gif,ico,webp}",
  },
};
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
  });
}

function clean() {
  return del(path.clean);
}

function html() {
  return src(path.src.html)
    .pipe(sourcemaps.init())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.build.html))
    .pipe(sourcemaps.write("."))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(cssconcat("bundle.css"))
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css));
}

function js() {
  return src(path.src.js)
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(uglify())
    .pipe(dest(path.build.js));
  // .pipe(browsersync.stream());
}
// function img() {
//   return src(path.src.img).pipe(imagemin()).pipe(dest(path.build.img));
// }

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  // gulp.watch([path.watch.img], img);
}

let build = gulp.series(clean, gulp.parallel(css, html, js));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
