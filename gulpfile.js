//Создаём переменные
let project_folder = "dist";
let source_folder = "src";

const fs = require("fs");
//Создаём переменные путей к файлам и папкам
let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/images/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    svg: source_folder + "/images/**/*.svg",
    fonts: source_folder + "/fonts/*.ttf",
    bs: source_folder + "/css/bootstrap-grid.min.css",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/images/**/*.{jpg,png,gif,ico,webp}",
    svg: source_folder + "/images/**/*.svg",
    res: source_folder + "/resources/**",
  },
  //удаление папки при запуске
  clean: "./" + project_folder + "/",
};

const { src, dest, watch, parallel, series } = require("gulp");

const concat = require("gulp-concat");
const scss = require("gulp-sass")(require("sass"));
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const del = require("del");
const uglify = require("gulp-uglify-es").default;
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const gutil = require("gulp-util");
const ftp = require("vinyl-ftp");
const fileinclude = require("gulp-file-include");

//const concat = require("gulp-concat");
//const scss = require("gulp-sass")(require("sass"));
//const browserSync = require("browser-sync").create();
//const uglify = require("gulp-uglify-es").default;
//const autoprefixer = require("gulp-autoprefixer");
//const imagemin = require("gulp-imagemin");
//const del = require("del");
//const js_plugins = [];
//const css_plugins = [];
//const fileinclude = require("gulp-file-include");

const js_plugins = [
  "node_modules/jquery/dist/jquery.js",
  "node_modules/swiper/swiper-bundle.min.js",
  "src/js/main.js",
];
const css_plugins = [
  "node_modules/swiper/swiper-bundle.min.css",
  "src/scss/style.scss",
];

const cb = () => {};

const browsersync = () => {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
    notify: false,
  });
};

const cleanDist = () => {
  return del("dist");
};

const images = () => {
  return src()
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
};

const scripts = () => {
  return src(js_plugins)
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
};

const styles = () => {
  return src(css_plugins)
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
};

const build = () => {
  return src(
    [
      "src/css/style.min.css",
      "src/fonts/**/*",
      "src/js/main.min.js",
      "src/*.html",
    ],
    { base: "src" }
  ).pipe(dest("dist"));
};

const htmlInclude = () => {
  return (
    src(["./src/*.html"]),
    pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    ),
    pipe(dest("./src")),
    pipe(browserSync.stream())
  );
};

const watching = () => {
  watch(["./src/scss/**/*.scss"], styles);
  watch(["./src/js/**/*.js", "!src/js/main.min.js"], scripts);
  watch(["./src/*.html"]).on("change", browserSync.reload, htmlInclude);
};

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);
