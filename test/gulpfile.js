var gulp = require('gulp');
var json2po = require('../index');
var rename = require('gulp-rename');

gulp.task('test', function() {
	return gulp.src('fixture/no.json')
		.pipe(json2po({'Language-Team': 'Geomatikk'}, 'template_no.po'))
		//.pipe(rename('template_no.po'))
		.pipe(gulp.dest('.'))
});
