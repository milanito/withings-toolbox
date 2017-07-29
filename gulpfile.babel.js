import gulp from 'gulp';
import esdoc from 'gulp-esdoc';
import eslint from 'gulp-eslint';
import istanbul from 'gulp-babel-istanbul';
import babel from 'gulp-babel';
import injectModules from 'gulp-inject-modules';
import mocha from 'gulp-mocha';
import rimraf from 'rimraf';

gulp.task('clean', done => rimraf('dist', () => done()));

gulp.task('doc', () => gulp.src('./src')
.pipe(esdoc({ destination: './docs' })));

gulp.task('lint', () => gulp.src(['./src/**/*.js',
  '!dist/**', '!node_modules/**', '!coverage/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('babel', ['clean'], () => gulp
  .src(['./src/**/*.js'])
  .pipe(babel({
    presets: [
      'es2015',
      'stage-2'
    ],
    plugins: [
      'add-module-exports'
    ]
  }))
  .pipe(gulp.dest('dist')));

gulp.task('prepare-test', () => gulp.src(['./src/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire()));

gulp.task('test', ['prepare-test'], () => gulp.src(['./tests/*.test.js'])
  .pipe(babel({
    presets: [
      'es2015',
      'stage-2'
    ],
    plugins: [
      'add-module-exports'
    ]
  }))
  .pipe(injectModules())
  .pipe(mocha({ timeout: 5000 }))
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }))
  .once('end', () => process.exit()));
