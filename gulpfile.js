// **************** REQUIREMENTS ****************
const gulp=require('gulp');
const rename=require('gulp-rename');
const greplace=require('gulp-replace');
const batchReplace = require('gulp-batch-replace')
const file=require('gulp-file');

const fs = require('fs');
const through = require('through2');

const input_folder_default = 'input'
const output_folder_default = 'output'
const basic_replacement_rules_default = [[]]

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
    let basic_replacement_rules = settings.basic_rules ? settings.basic_rules : basic_replacement_rules_default
    let smart_replacement_rules = settings.smart_rules ? settings.smart_rules : smart_replacement_rules_default
    for (let i = 0; i < basic_replacement_rules.length; i++) {
      basic_replacement_rules[i][0] = RegExp(basic_replacement_rules[i][0], 'g')
    }
    function smart_replace(filename, content) {
      // Retrieve the subitem of a Replacement Descriptor (aka an item of the "smart_rules" property)
      function getRepDescrSubitem(rep_descriptor, subitem_type) {
        let subitem = undefined
        if(Array.isArray(rep_descriptor)){
          switch(subitem_type){
            case "match": subitem = 0; break;
            case "replace": subitem = 1; break;
          }
        } else if(typeof(rep_descriptor)=='object') {
          subitem = rep_descriptor[subitem_type]
        }
        return subitem
      }
      // Convert (if need be) the replace subitem into  astring appropriate to the current file
      function defineReplacement(rep_obj) {
        if (typeof(rep_obj)=='String') return rep_obj
        if(rep_obj.byfilename){
          for(file_rep of rep_obj.byfilename){
            if( filename.match(RegExp(file_rep[0])) ) return file_rep[1]
          }
        }
        // If byfilename isn't found or the current file didn't match any of the items of byfilname, return the default
        // If default isn't set, "undefined" will be returned
        return rep_obj.default
      }
      // loop through the list of replacement descriptors
      for (let i = 0; i < smart_replacement_rules.length; i++) {
        let match = RegExp(getRepDescrSubitem(smart_replacement_rules[i], 'match'), 'g')
        let replacement = defineReplacement(getRepDescrSubitem(smart_replacement_rules[i], 'replace'))
        if(replacement){
          content = content.replace(match, replacement)
        }
        // If replace is an object and replace.default = false and the current file do not match replace.byfilename's items, the content won't be modified
      }
      return content
    }
    gulp.src('content/'+input_folder+'/**.*')
      .pipe(batchReplace(basic_replacement_rules))
      .pipe(through.obj(function(file, enc, cb) {
        file.contents = new Buffer(smart_replace(file.relative, file.contents.toString()))
        cb(null, file)
      }))
      .pipe(gulp.dest('content/'+output_folder))
  }
})