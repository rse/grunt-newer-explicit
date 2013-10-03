
# grunt-newer-explicit

<p/>
<img src="https://nodei.co/npm/grunt-newer-explicit.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/grunt-newer-explicit.png" alt=""/>

Grunt Task for running tasks if source files are newer only.

This mimics the behaviour of good old Unix build tool `make(1)` within
the Grunt build tool, i.e., destination files are only built if either
the destination file is still not existing at all or the corresponding
source files are newer. As a result, on subsequent build runs, this
allows you to rebuild just those artifacts which are really out-of-date.

It is also a little bit similar to (and even can be combined with) the
Grunt `watch` task (from the `grunt-contrib-watch` package). But instead
of continiously monitoring the filesystem for modifications, this task
only checks the modification time (`mtime`) of the files once.

Notice that there is another Grunt plugin named
[grunt-newer](https://npmjs.org/package/grunt-newer) which provides a
similar functionality, but performs its operation implicitly and has to
store timestamps to know what has changed between runs. I prefer the
more explicit and database-less way as in the old Unix `make(1)`, hence
I created this task `grunt-newer-explicit`.

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/)
before, be sure to check out the [Getting
Started](http://gruntjs.com/getting-started) guide, as it explains how
to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process,
you may install this plugin with this command:

```shell
npm install grunt-newer-explicit --save-dev
```

Once the plugin has been installed, it may be enabled inside your
Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks("grunt-newer-explicit");
```

## Task Options

- `tasks`: (default `[]`) the names of Grunt tasks to run if one of
   the `src` files are newer than the `dest` file (or the `dest` file is still not existing).

## Running the Task

_Run this task with the `grunt newer` command._

Task targets, files and options may be specified according to the Grunt
[Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

## Usage Example

```js
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-newer");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.initConfig({
        copy: {
            "foo": { src: "src/foo.txt", dest: "build/foo.txt" },
            "bar": { src: "src/bar.txt", dest: "build/bar.txt" }
        },
        newer: {
            "foo": {
                src: [ "src/foo.txt" ],
                dest: "build/foo.txt",
                options: { tasks: [ "copy:foo" ] }
            },
            "bar": {
                src: [ "src/bar.txt" ],
                dest: "build/bar.txt",
                options: { tasks: [ "copy:bar" ] }
            }
        },
        watch: {
            "all": {
                files: [ "src/*.txt" ],
                tasks: [ "newer" ]
            }
        },
        clean: {
            clean:     [ "build" ],
            distclean: [ "node_modules" ]
        }
    });

    grunt.registerTask("default", [ "newer" ]);
};
```

