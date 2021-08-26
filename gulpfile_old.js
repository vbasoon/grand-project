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

const { src, dest, parallel, series, watch } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const del = require("del");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const gutil = require("gulp-util");
const ftp = require("vinyl-ftp");

const cb = () => {};

let srcFonts = "./src/scss/_fonts.scss";
let appFonts = "./dist/fonts/";

const fonts = () => {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
};

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, "", cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split(".");
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(
            srcFonts,
            '@include font-face("' +
              fontname +
              '", "' +
              fontname +
              '", 400);\r\n',
            cb
          );
        }
        c_fontname = fontname;
      }
    }
  });

  done();
};

const svgSprites = () => {
  return src(path.src.svg)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(path.build.img));
};

const styles = () => {
  return src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: "expanded",
      }).on("error", notify.onError())
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
};

const htmlInclude = () => {
  return src(path.src.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist"))
    .pipe(browserSync.stream());
};

const resources = () => {
  return src("./src/resources/*").pipe(dest("./dist"));
};

const clean = () => {
  return del(["dist/*"]);
};

const scripts = () => {
  return src("./src/js/main.js")
    .pipe(
      webpackStream({
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", { targets: "defaults" }]],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/js"))
    .pipe(browserSync.stream());
};

const imgToApp = () => {
  return src([path.src.img, path.src.svg]).pipe(dest(path.build.img));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
  watch(path.watch.css, styles);
  watch(path.watch.html, htmlInclude);
  watch(path.watch.img, imgToApp);
  watch(path.watch.svg, svgSprites);
  watch(path.watch.res, resources);
  watch("./src/fonts/**.ttf", fonts);
  watch("./src/fonts/**.ttf", fontsStyle);
  watch(path.watch.js, scripts);
};

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;
exports.imgToApp = imgToApp;

exports.default = series(
  clean,
  parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites),
  fontsStyle,
  styles,
  watchFiles
);

//-------------Buid----------------------

const stylesBuild = () => {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      }).on("error", notify.onError())
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )

    .pipe(dest(path.build.css));
};

const scriptsBuild = () => {
  return src("./src/js/main.js")
    .pipe(
      webpackStream({
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", { targets: "defaults" }]],
                },
              },
            },
          ],
        },
      })
    )

    .pipe(uglify().on("error", notify.onError()))

    .pipe(dest("./dist/js"));
};

const imagesBuild = () => {
  //import imagemin from "gulp-imagemin";
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img));
};

exports.build = series(
  clean,
  parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites),
  fontsStyle,
  stylesBuild,
  imagesBuild
);

/*------------ Deploy ------------------*/
const deploy = () => {
  let conn = ftp.create({
    host: "",
    user: "",
    password: "",
    parallel: 10,
    log: gutil.log,
  });

  let globs = ["dist/**"];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return src(globs, {
    base: ".",
    buffer: false,
  })
    .pipe(conn.newer("")) // only upload newer files
    .pipe(conn.dest(""));
};

exports.deploy = deploy;
