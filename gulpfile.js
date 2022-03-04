import { execSync }          from 'child_process'
import bs                    from 'browser-sync'
import del                   from 'del'
import autoprefix            from 'gulp-autoprefixer'
import ejs                   from 'gulp-ejs'
import { createGulpEsbuild } from 'gulp-esbuild'
import gulp                  from 'gulp'
import log                   from 'gulplog'
import gulpJest              from 'gulp-jest'
import rename                from 'gulp-rename'
import gulpSass              from 'gulp-sass'
import typedoc               from 'gulp-typedoc'
import path                  from 'path'
import dartSass              from 'sass'
import ts                    from 'typescript'
import YARGS                 from 'yargs'
import { hideBin }           from 'yargs/helpers'

import 'isomorphic-fetch'



const { src, dest:dst, series:ser, parallel:par } = gulp



// ---------------------------------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------------------------------

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

  const path = ts.findConfigFile(basePath, ts.sys.fileExists)
  const file = ts.readConfigFile(path, ts.sys.readFile)

  file.error && fail(file.error)

  const cnf = ts.parseJsonConfigFileContent(file.config, ts.sys, basePath)
  cnf?.errors?.length && fail(`failed to parse tsconfig\n${ cnf.errors.map(e => `  ${ e.messageText }\n`) }`)

  return cnf
}

class colour {
  static c(colour, msg) { return `\u001b[${ colour }m${ msg }\u001b[0m` }
  static b(colour, msg) { return this.c(colour + ';1', msg)             }

  static red(msg)       { return this.c(31, msg) }
  static green(msg)     { return this.c(32, msg) }
  static yellow(msg)    { return this.c(33, msg) }
  static blue(msg)      { return this.c(34, msg) }
  static magenta(msg)   { return this.c(35, msg) }

  static bRed(msg)      { return this.b(31, msg) }
  static bGreen(msg)    { return this.b(32, msg) }
  static bYellow(msg)   { return this.b(33, msg) }
}

const wait = (ms, callback) => {
  return new Promise(resolve => setTimeout(resolve, ms)).then(callback)
}


// ---------------------------------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------------------------------

const configParser = (defaults) => {

  const defaultHost = new URL(defaults.host)

  const handleFailure = (msg, err, yargs) => {
    msg && console.log(colour.bYellow(msg), '\n')
    err && console.log(err, '\n')
    yargs.showHelp()
    process.exit(1)
  }

  const checkOptions = (argv) =>
    // http://yargs.js.org/docs/#api-reference-checkfn-globaltrue
    // - If URL throws from a malformed url, then the check fails
    // - If neither `port` nor `host` are truthy, then the check fails
    !!(argv.port || (argv.host && new URL(argv.host)))

  const getCommand = (argv) =>
    argv._[0] ?? 'default'

  const coerceOptions = (yargs) => {
    const { argv } = yargs

    const host = argv.host ? argv.host
               : argv.port ? `${ defaultHost.protocol }//${ defaultHost.hostname }:${ argv.port }`
               : defaultHost

    return yargs.coerce({
      command : () => getCommand(argv),
      host    : () => new URL(host),
    })
  }

  const extractArgs = (yargs) =>
    yargs.parse()


  const _parse = (args) => {
    const yargs = YARGS(hideBin(args))

    return yargs
      .command('watch',
        'Build in development mode with watch enabled.',
        (yargs) => yargs
          .option('port', {
            describe: 'Sets the port that the test server listens to.',
            default: 4040,
            number: true,
          })
          .option('host', {
            describe: 'Sets the address of the test server.',
            type: 'string',
            default: 'localhost',
            requiresArg: true,
          })
          .check(checkOptions)
          .help('info')
      )
      .command('build',
        'Builds the application in production mode.',
        (yargs) => yargs
          .option('host', {
            describe: 'Sets the base URL to fetch resources from.',
            type: 'string',
            requiresArg: true,
          })
          .demandOption('host', '- A host URL is required for generating the application config.')
          .check(checkOptions)
          .help('info')
      )
      .command('test',
        'Runs the test suite',
        (yargs) => yargs
        .option('host', {
          describe: 'Sets the base URL for tests to fetch resources from. Has no effect without specifying the --live flag.',
          type: 'string',
          default: defaultHost
        })
        .option('live', {
          alias: ['L'],
          description: 'Runs all tests requiring a connection to testing server. No online tests will be executed without specifying this option.',
        })
        .check(checkOptions)
        .help('info')
      )
      .hide('version')
      .hide('help')
      .showHelpOnFail(true)
      .wrap(yargs.terminalWidth())
      .exitProcess(true)
      .help('info', 'Use `gulp [command] --info` to get command usage information.')
      .fail(handleFailure)
  }

  const parse = (args) => Promise.resolve(args)
    .then(_parse)
    .then(coerceOptions)
    .then(extractArgs)

  return { parse }
}



// ---------------------------------------------------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------------------------------------------------

const argv   = await configParser({ host: 'http://localhost:4040' }).parse(process.argv)
const config = {}

config.projectName = 'TEngine'
config.srcroot     = path.resolve('./src')
config.srcdest     = path.resolve('./build')
config.cache       = path.resolve('./build/cache')
config.public      = path.resolve('./build/public')
config.host        = argv.host
config.isDevBuild  = argv.command !== 'build'
config.buildMode   = config.isDevBuild ? 'development' : 'production'
config.assetTypes  = [
  'bmp',
  'jpg',
  'png',
  'svg',
  'mp3',
  'wav',
  'json',
  'vert',
  'frag'
].join('|')

// Config paths --------------------------------------------------------------------------------------------------------
const paths = {
  src: {
    root      : config.srcroot,
    styles    : path.join(config.srcroot, './scss'),
    assets    : [
                path.join(config.srcroot, './engine/assets'),
                path.join(config.srcroot, './game/assets')
              ],
    tests     : path.resolve('./test'),
  },
  dst: {
    root      : config.srcdest,
    public    : config.public,
    cache     : config.cache,

    assets    : path.join(config.public, './assets'),
    docs      : path.join(config.public, './docs'),
    scripts   : path.join(config.public, './scripts'),
    styles    : path.join(config.public, './styles'),
  },
}

// Plugin options ------------------------------------------------------------------------------------------------------
const pluginOptions = {}

pluginOptions.bs = {
  servername  : `${ config.projectName }`,
  listen      : config.host.hostname,
  open        : false,
  port        : config.host.port,
  ui          : false,
  online      : false, // reduce startup time
  server: {
    baseDir   : paths.dst.public,
    index     : 'index.html'
  },
  reloadDebounce: 100, // milliseconds
}

pluginOptions.esbuild = {
  sourcemap   : config.isDevBuild,
  outfile     : 'index.js',
  bundle      : true
}

pluginOptions.jest = {
  rootDir     : './test',
  showConfig  : false,
  ...(argv.live
          ? { testMatch: ['<rootDir>/live/(*.)+(spec|test).[tj]s?(x)'] }
          : { testPathIgnorePatterns: [ '<rootDir>/live/'            ] }
     ),
}

pluginOptions.sass = {
  outputStyle : (config.isDevBuild ? 'expanded' : 'compressed')
}

pluginOptions.typedoc = {
  name        : `${ config.projectName } Documentation`,
  out         :  paths.dst.docs,
  emit        : 'both',
  theme       : 'default',
  version     : true,
  tsconfig    : './src/tsconfig.json',
  plugin      : [ 'typedoc-plugin-missing-exports' ],
  logger      : 'none',
  sort        : ['static-first', 'enum-value-ascending']
}



// ---------------------------------------------------------------------------------------------------------------------
// Plugin Initialisation
// ---------------------------------------------------------------------------------------------------------------------

const esbuild = createGulpEsbuild({ incremental: config.isDevBuild })
const jest    = gulpJest.default
const sass    = gulpSass(dartSass)
const bsync   = bs.create(pluginOptions.bs.servername)



// ---------------------------------------------------------------------------------------------------------------------
// Gulp Tasks
// ---------------------------------------------------------------------------------------------------------------------

// API Tasks -----------------------------------------------------------------------------------------------------------
const assets = async () => {
  /** @todo optimize as needed */
  return src(paths.src.assets.map(path => `${ path }/**/*`), { allowEmpty: true })
    .pipe(dst(paths.dst.assets))
    .on('error', log.error)
}

const clean = async () => {
  await del(`${ paths.dst.public }`)
}

const docs = async () => {
  return src(`${ paths.src.root }/engine/**/*.ts`)
    .pipe(typedoc(pluginOptions.typedoc))
    .on('error', log.error)
}

const markup = async () => {
  return src(`${ paths.src.root }/**/*.@(ejs)`)
    .pipe(ejs())
    .pipe(rename({ extname: '' }))
    .pipe(dst(paths.dst.public))
    .on('error', log.error)
}

const scripts = async () => {
  return src(`${ paths.src.root }/main.ts`)
    .pipe(esbuild(pluginOptions.esbuild))
    .pipe(dst(paths.dst.public))
    .on('error', log.error)
}

const styles = async () => {
  return src(`${ paths.src.styles }/**/*.@(css|scss)`, { sourcemaps: config.isDevBuild })
    .pipe(sass(pluginOptions.sass))
    .pipe(autoprefix())
    .pipe(dst(paths.dst.styles), { sourcemaps: config.isDevBuild })
    .pipe(bsync.stream())
}

const refreshBrowser = async () => {
  bsync.reload()
}

const serverStart = async () => {
  bsync.init(pluginOptions.bs)
}

const serverStop = async () => {
  bsync.exit()
}

const runningLiveTestsLocally =
  argv.live && argv.host.hostname === 'localhost'

const startServerForLiveTests = async () =>
  new Promise((resolve, reject) => runningLiveTestsLocally ? resolve() : reject())
    .then(serverStart)
    .then(async (r) => await wait(100, r))
    .catch(() => { /* no-op */ })

const stopServerForLiveTests = async () =>
  new Promise((resolve, reject) => runningLiveTestsLocally ? resolve() : reject())
    .then(async (r) => await wait(2000, r))
    .then(serverStop)
    .catch(() => { /* no-op */ })

const serve = async () => {
  serverStart()
}

const setenv = async () => {
  process.env.BUILD_MODE = config.buildMode
  process.env.BUILD_DATE = getBuildDate()
  process.env.BUILD_REV  = getBuildRevision()
  process.env.BASE_URL   = config.host.href
}

const runTests = () => {
  process.env.NODE_ENV = 'test'
  return src(paths.src.tests)
    .pipe(jest(pluginOptions.jest))
    .on('error', log.error)
}

gulp.task('watch:assets', async () => {
  /** @todo optimize as needed */
  const pathGlob = `${ paths.src.root }/**/*.@(${ config.assetTypes })`
  gulp.watch(pathGlob, ser(assets, refreshBrowser))
})

gulp.task('watch:markup', async () => {
  gulp.watch(`${ paths.src.root }/**/*.@(ejs|html)`, ser(markup, refreshBrowser))
})

gulp.task('watch:scripts', async () => {
  gulp.watch(`${ paths.src.root }/**/*.@(ts|js)`, ser(par(scripts, docs), refreshBrowser))
})

gulp.task('watch:styles', async () => {
  gulp.watch(`${ paths.src.styles }/**/*.@(css|scss)`, styles)
})

const build = ser(clean, setenv, par(assets, markup, scripts, docs, styles))
const test  = ser(setenv, startServerForLiveTests, runTests, stopServerForLiveTests)
const watch = ser(build, serve, par('watch:assets', 'watch:markup', 'watch:scripts', 'watch:styles'))

export {
  build,
  clean,
  docs,
  watch,
  test,
  watch as default,
}

;(function logBuildOrTestMode (command) {
    switch(command) {
      case 'default' :
      case 'watch'   :
      case 'build'   : log.info(`Building in ${ colour.bYellow(config.buildMode) } mode...`       ); break
      case 'test'    : log.info(`Running ${ colour.green(argv.live ? 'live tests' : 'tests') }...`); break
    }
})(argv.command)
