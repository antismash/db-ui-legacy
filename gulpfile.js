'use strict';
var fs = require('fs');
var gulp = require('gulp');

fs.readdirSync(__dirname + '/gulp').forEach(function (module) {
  if(module.endsWith('.js')){
    require(__dirname + '/gulp/' + module);
  }
})

gulp.task('build', ['vendor', 'js', 'html', 'less', 'css', 'static']);
gulp.task('default', ['vendor', 'js:watch', 'html:watch', 'less:watch', 'server']);
