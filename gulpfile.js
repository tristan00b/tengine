import path           from 'path'
import { execSync }  from 'child_process'

import browserSync    from 'browser-sync'
import del            from 'del'
import autoprefix     from 'gulp-autoprefixer'
import ejs            from 'gulp-ejs'
import {
  createGulpEsbuild } from 'gulp-esbuild'
import gulp           from 'gulp'
import log            from 'gulplog'
import gulpif         from 'gulp-if'
import rename         from 'gulp-rename'
import gulpSass       from 'gulp-sass'
import sourcemaps     from 'gulp-sourcemaps'
import typedoc        from 'gulp-typedoc'
import dartSass       from 'sass'
import ts             from 'typescript'

const { src, dest:dst, series:ser, parallel:par } = gulp



// ---------------------------------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------------------------------

const isDevelopmentBuild = () => {
  return !process.argv.includes('build')
}

const getBuildRevision = () => {
  return execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
}

const getBuildDate = () => {
  const d = new Date()
  return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()].join('/')
}

const loadTSConfigForBasePath = (basePath) => {
  const fail = (msg) => {
    throw new Error(msg)
  }

  const fpath = ts.findConfigFile(basePath, ts.sys.fileExists)

  const file = ts.readConfigFile(fpath, ts.sys.readFile)
  file.error && fail(file.error)

  const cnf = ts.parseJsonConfigFileContent(file.config, ts.sys, basePath)
  cnf?.errors?.length && fail(`failed to parse tsconfig\n${cnf.errors.map(e => `  ${e.messageText}\n`)}`)

  return cnf
}

class colour {
  static c(colour, msg) { return `\u001b[${colour};1m${msg}\u001b[0m` }
  static red(msg)       { return this.c(31, msg) }
  static green(msg)     { return this.c(32, msg) }
  static yellow(msg)    { return this.c(33, msg) }
  static blue(msg)      { return this.c(34, msg) }
}



// ---------------------------------------------------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------------------------------------------------

const projectName = 'Tristris Engine'

const isDevBuild = isDevelopmentBuild()
const buildMode  = isDevBuild ? 'development'
                              : 'production'

log.info(`Building in ${colour.yellow(buildMode)} mode...`)

const srcroot   = path.resolve('./src')
const srcdest   = path.resolve('./build')
const cache     = path.resolve(srcdest, './cache')
const dist      = path.resolve(srcdest, './public')

const paths = {
  src: {
    root        : srcroot,
    styles      : path.join(srcroot, './scss'),
    assets      : path.join(srcroot, './game/assets')
  },
  dst: {
    root        : srcdest,
    public      : dist,
    cache       : cache,

    assets      : path.join(dist, './assets'),
    docs        : path.join(dist, './docs'),
    scripts     : path.join(dist, './scripts'),
    styles      : path.join(dist, './styles'),
  },
}

const options = {
  bsync: {
    listen      : 'localhost',
    open        : false,
    port        : 4040,
    ui          : false,
    server: {
      baseDir   : paths.dst.public,
      index     : 'index.html'
    }
  },

  esbuild: {
    sourcemap   : isDevBuild,
    outfile     : 'index.js',
    bundle      : true
  },

  sass: {
    outputStyle : (isDevBuild ? 'expanded' : 'compressed')
  },

  typedoc: {
    name        : `${projectName} Documentation`,
    out         :  paths.dst.docs,
    emit        : 'both',
    theme       : 'default',
    version     : true,
    tsconfig    : './src/tsconfig.json',
    plugin      : [
      'typedoc-plugin-missing-exports'
    ]
  },

  assetTypes: [
    'bmp',
    'jpg',
    'png',
    'svg',
    'mp3',
    'wav',
    'json',
  ]
}



// ---------------------------------------------------------------------------------------------------------------------
// Plugin Initialization
// ---------------------------------------------------------------------------------------------------------------------

const bsync = browserSync.create()

const esbuild = createGulpEsbuild({
  incremental: isDevBuild
})

const sass = gulpSass(dartSass)



// ---------------------------------------------------------------------------------------------------------------------
// Gulp Tasks
// ---------------------------------------------------------------------------------------------------------------------


const assets = async () => {
  /** @todo optimize as needed */
  src(paths.src.assets, { allowEmpty: true }).pipe(dst(paths.dst.assets)).on('error', log.error)
}

const clean = async () => {
  await del(`${paths.dst.public}`)
}

const docs = async () => {
  return src(`${paths.src.root}/engine/**/*.ts`)
    .pipe(typedoc(options.typedoc))
    .on('error', log.error)
}

const markup = async () => {
  return src(`${paths.src.root}/**/*.@(ejs|html)`)
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dst(paths.dst.public))
    .on('error', log.error)
}

const scripts = async () => {
  return src(`${paths.src.root}/main.ts`)
    .pipe(esbuild(options.esbuild))
    .pipe(dst(paths.dst.public))
    .on('error', log.error)
}

const styles = async () => {
  return src(`${paths.src.styles}/**/*.@(css|scss)`)
    .pipe(gulpif(isDevBuild, sourcemaps.init()))
    .pipe(sass(options.sass))
    .pipe(autoprefix())
    .pipe(gulpif(isDevBuild, sourcemaps.write()))
    .pipe(dst(paths.dst.styles))
    .pipe(bsync.stream())
}

const refreshBrowser = async () => {
  bsync.reload()
}

const serve = async () => {
  bsync.init(options.bsync)
}

const setenv = async () => {
  process.env.PROJECT_NAME = projectName
  process.env.BUILD_MODE   = buildMode
  process.env.BUILD_DATE   = getBuildDate()
  process.env.BUILD_REV    = getBuildRevision()
}



gulp.task('watch:assets', async () => {
  /** @todo optimize as needed */
  const pathGlob = `${paths.src.root}/**/*.@(${options.assetTypes.join('|')})`
  gulp.watch(pathGlob, ser(assets, refreshBrowser))
})

gulp.task('watch:markup', async () => {
  gulp.watch(`${paths.src.root}/**/*.@(ejs|html)`, ser(markup, refreshBrowser))
})

gulp.task('watch:scripts', async () => {
  gulp.watch(`${paths.src.root}/**/*.@(ts|js)`, ser(par(scripts, docs), refreshBrowser))
})

gulp.task('watch:styles', async () => {
  gulp.watch(`${paths.src.styles}/**/*.@(css|scss)`, styles)
})



const build = ser(clean, setenv, par(assets, markup, scripts, docs, styles))
const watch = ser(build, par('watch:assets', 'watch:markup', 'watch:scripts', 'watch:styles', serve))



export {
  build,
  clean,
  watch,
  watch as default
}
