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
const replacement_rules_default = []

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
    let replacement_rules = settings.replacement_rules ? settings.replacement_rules : replacement_rules_default

    function smart_replace(filename, content) {
      /////////////////////////////////////////
      //    FUNCTIONS DEFINITION
      /////////////////////////////////////////
      // Retrieve the subitem of a Replacement Descriptor (aka an item of the "replacement_rules" property)
      function getRepDescrSubitem(rep_descriptor, subitem_type) {
        let subitem = undefined
        if(Array.isArray(rep_descriptor)){
          if(rep_descriptor.length == 0) return false // If the array is empty, exit and return a 'false' descriptor
          switch(subitem_type){
            case "match": subitem = rep_descriptor[0]; break;
            case "replace": subitem = rep_descriptor[1]; break;
          }
        } else if(typeof(rep_descriptor)=='object') {
          if(Object.keys(rep_descriptor).length == 0) return false // If the object is empty, exit and return a 'false' descriptor
          subitem = rep_descriptor[subitem_type]
        }
        return subitem
      }
      // check if the obj defining either a search or a replacement is a simple string or is an object containing a "byfilename" list of string to search/replace
      function checkByfilename(obj) {
        if (typeof(obj)=='string') return obj
        if(obj.byfilename){
          for(file_rep of obj.byfilename){
            if( filename.match(RegExp(file_rep[0])) ) return file_rep[1]
          }
        }
        // If byfilename isn't found or the current file didn't match any of the items of byfilname, return the default
        // If default isn't set, "undefined" will be returned
        return obj.default
      }
      // Convert (if need be) the search subitem into a string appropriate to the current file
      function defineSearch(search_obj) {
        let match = checkByfilename(search_obj)
        let isRegex = search_obj.noReg == true ? false : true;
        let flags = typeof(search_obj.flags) == 'string' ? search_obj.flags : 'g'
        return isRegex == true ? RegExp(match, flags) : match
      }
      // Convert (if need be) the replace subitem into a string appropriate to the current file
      function defineReplacement(rep_obj) {
        let replacement = checkByfilename(rep_obj)
        return replacement
      }
      /////////////////////////////////////////
      //    LOOP THROUGH REPLACEMENT RULES
      /////////////////////////////////////////
      // loop through the list of replacement descriptors
      for (let i = 0; i < replacement_rules.length; i++) {
        let match = defineSearch(getRepDescrSubitem(replacement_rules[i], 'match'))
        let replacement = defineReplacement(getRepDescrSubitem(replacement_rules[i], 'replace'))
        if(replacement){
          content = content.replace(match, replacement)
        }
        // If replace is an object and replace.default = false and the current file do not match replace.byfilename's items, the content won't be modified
      }
      return content
    }
    gulp.src('content/'+input_folder+'/**.*')
      .pipe(through.obj(function(file, enc, cb) {
        file.contents = new Buffer(smart_replace(file.relative, file.contents.toString()))
        cb(null, file)
      }))
      .pipe(gulp.dest('content/'+output_folder))
  }
})