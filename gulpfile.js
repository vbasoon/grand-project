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
const server = require("browser-sync").create();
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
  "./src/js/main.js",
];
const css_plugins = [
  "node_modules/swiper/swiper-bundle.min.css",
  "./src/scss/style.scss",
];

const cb = () => {};

const browsersync = () => {
  server.init({
    server: {
      baseDir: project_folder,
    },
    notify: false,
  });
};

const cleanDist = () => {
  return del(path.clean);
};

const images = () => {
  return src("src/images/**/*")
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
    .pipe(dest(path.build.img));
};

const scripts = () => {
  return src(js_plugins)
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(server.stream());
};

const styles = () => {
  return src(css_plugins)
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: "compressed",
      }).on("error", notify.onError())
    )
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(path.build.css))
    .pipe(server.stream());
};

const buildCopy = () => {
  return src(
    [
      "src/css/**/*.min.css",
      "src/js/**/*.min.js",
      "src/images/**/*",
      "src/**/*.html",
      "src/fonts/**/*",
      "src/resouces/**/*",
    ],
    { base: "src" }
  ).pipe(dest("dist"));
};

const html = () => {
  return src(path.src.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(server.stream());
};

const imageToApp = () => {
  return src("src/images/**/*").pipe();
};

const watching = () => {
  watch("./src/**/*.html", html).on("change", server.reload);
  watch("./src/scss/**/*.scss", styles).on("change", server.reload);
  watch(["./src/js/**/*.js", "!src/js/main.min.js"], scripts).on(
    "change",
    server.reload
  );
  //watch(["./src/scss/**/*.scss"], styles);
  //watch(["./src/js/**/*.js", "!src/js/main.min.js"], scripts);
  //watch(["./src/*.html"]);
};

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.html = html;

exports.build = series(cleanDist, styles, scripts, images, html, buildCopy);
exports.default = series(
  cleanDist,
  parallel(html, styles, scripts, images, browsersync, watching)
);
