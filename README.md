# HTML Remixer
A simple gulp-based tool to quickly correct an HTML file.

This project was build to help those that have to make repetitive modifications on HTML files (rewrite URL, escape characters, etc… )

## INSTALL
1. Install the latest nodeJS version (9.10.1 when this readme was written)
2. Open your command line tool and type the following : npm install gulp -g 
(this will install gulp globally)
3. in the command line tool, type "cd " followed by the path to the folder where is stored html-remixer
4. type: npm install

## SET THE REPLACEMNT RULES
Go in the settings.json file and update the "rules" array:

- each replacement is modeled by an array containing only two elements
- the first element describe the string to match (NOTE: you can use the regex syntax)
- the second element describe the string that will replace it
- each replacement will be executed in the order they are inputed
- there is no limit to the number of replacement you can set

Don't hesitate to replace the few examples provided with you own rules !

## USE
1. In the html-remixer folder, create a content/ folder and a subfolder input/ (this is the default folder, to be sure it is the correct one, check the settings.json file)
2. Add in the subfolder you created the files you want to remix
3. In the command line tool, type "cd " followed by the path to the folder where is stored html-remixer
4. Type: gulp
5. Wait a few millisecond for the script to let you know its finished and then check the new subfolder created in content/. Your files are there, remixed !