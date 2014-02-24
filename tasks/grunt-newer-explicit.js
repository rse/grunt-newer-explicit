/*
**  grunt-newer-explicit -- Grunt Task for running tasks if source files are newer only
**  Copyright (c) 2013-2014 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module:  false */
module.exports = function (grunt) {

    /* global require: false */
    var path  = require("path");
    var fs    = require("fs");
    var chalk = require("chalk");

    /*  define the Grunt task  */
    grunt.registerMultiTask("newer", "Run tasks if source files are newer only", function () {
        /*  prepare options  */
        var options = this.options({
            tasks: []
        });
        grunt.verbose.writeflags(options, "Options");

        /*  utility function for determining information about a file  */
        var statFile = function (filename) {
            var stat;
            try { stat = fs.statSync(filename); }
            catch (err) { stat = null; }
            return stat;
        };

        /*  utility function for determining modification time from file information  */
        var mtimeOf = function (stat) {
            var mtime;
            try { mtime = stat.mtime.getTime(); }
            catch (err) { mtime = 0; }
            return mtime;
        };

        /*  iterate over all src-dest file pairs...  */
        var newer = false;
        this.files.forEach(function (f) {
            /*  short-circuit processing  */
            if (newer)
                return;

            /*  iterate over all source files... */
            f.src.forEach(function (src) {
                /*  short-circuit processing  */
                if (newer)
                    return;

                /*  check for source file  */
                var src_stat = statFile(src);
                if (src_stat === null) {
                    grunt.log.warn("Source file \"" + chalk.red(src) + "\" not found.");
                    return;
                }

                /*  check for destination file  */
                var dst = f.dest;
                if (dst.match(/\/$/))
                    dst = path.join(dst, path.basename(src));
                var dst_stat = statFile(dst);

                /*  if destination file is (still) not existing or
                    out-of-date we know that the source file is newer  */
                if (dst_stat === null) {
                    grunt.log.writeln("Destination file \"" + chalk.red(dst) + "\" not found.");
                    newer = true;
                }
                else if (mtimeOf(src_stat) > mtimeOf(dst_stat)) {
                    grunt.log.writeln("Destination file \"" + chalk.red(dst) + "\" out-of-date.");
                    newer = true;
                }
            });
        });

        /*  in case one of the source files is newer, run the specified
            tasks to allow the destination files to be (re)created */
        if (newer) {
            grunt.log.writeln("Running tasks: \"" +
                options.tasks
                .map(function (task) { return chalk.green(task); })
                .join("\", \"") +
            "\"");
            grunt.task.run(options.tasks);
        }
        else
            grunt.log.writeln(chalk.gray("Nothing changed."));
    });
};

