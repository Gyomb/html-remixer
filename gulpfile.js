// **************** REQUIREMENTS ****************
const gulp=require('gulp');
const rename=require('gulp-rename');
const file=require('gulp-file');

const fs = require('fs');



// **************** TASKS ****************
gulp.task('default', function() {
  // get replacement rules
  let replacement_rules = false
  try { replacement_rules = fs.readFileSync('./settings.json') }
  catch(e){ console.error('./settings.json doesn\'t exist') }
  if(replacement_rules){
    // if a replacement rules was found, keep up…
    replacement_rules = JSON.parse(replacement_rules)
  }
})