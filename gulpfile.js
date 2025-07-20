const { src, dest } = require('gulp');

function copyIcons() {
	return src('nodes/**/*.{png,svg}')
		.pipe(dest('dist/nodes'));
}

exports.copyIcons = copyIcons;
exports['build:icons'] = copyIcons; 