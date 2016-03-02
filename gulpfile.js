var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {
    nodemon({
        script: 'server.js',  //what to run
        ext: 'js',  //what to watch for
        env: {
            PORT: 6680
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function() {
        console.log('restarting');
    });
});