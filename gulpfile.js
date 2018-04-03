// **************** REQUIREMENTS ****************
const gulp=require('gulp');
const rename=require('gulp-rename');
const replace=require('gulp-replace');
const batchReplace = require('gulp-batch-replace')
const file=require('gulp-file');

const fs = require('fs');

const input_folder_default = 'input'
const output_folder_default = 'output'
const replacement_rules_default = [[]]

// **************** TASKS ****************
gulp.task('default', function() {
  // get replacement rules
  let settings = false
  try { settings = fs.readFileSync('./settings.json') }
  catch(e){ console.error('./settings.json doesn\'t exist') }
  if(settings){
    // if a replacement rules was found, keep up
    settings = JSON.parse(settings)
    let input_folder = settings.input ? settings.input : input_folder_default
    let output_folder = settings.output ? settings.output : output_folder_default
    let replacement_rules = settings.rules ? settings.rules : replacement_rules_default
    for (let i = 0; i < replacement_rules.length; i++) {
      replacement_rules[i][0] = RegExp(replacement_rules[i][0])
    }
    gulp.src('content/'+input_folder+'/**.*')
      .pipe(batchReplace(replacement_rules))
      .pipe(gulp.dest('content/'+output_folder))
  }
})