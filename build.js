#!/usr/bin/env node
var browserify = require('browserify');
var tsify = require('tsify');
var babelify = require("babelify");

browserify()
    .add('src/app.ts')
    .plugin(tsify, { target: 'es6', global: true })
    .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(process.stdout);
