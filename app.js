var fontSrc = __dirname + '/ttf/';
var fileSrc = '';
var chokidar = require('chokidar');
var Fontmin = require('fontmin');
var jsdom = require('jsdom');
var fs = require('fs');
var mkdirp = require('mkdirp');
var log4js = require('log4js');
var rename = require('gulp-rename');
var curDir = __dirname;

log4js.loadAppender('file');

log4js.addAppender(log4js.appenders.file('logs/benfont.log'), 'shaobing');

var logger = log4js.getLogger('shaobing');




var changeCallback = function(path) {
    logger.info(path, ' change or add');
    checkFontExist(path);
}
var watchExe = function(src) {
    fileSrc = src;

    // 初始化监听器
    var watcher = chokidar.watch(fileSrc, {
        persistent: true,
        ignoreInitial: true
    });
    watcher.on('add', changeCallback).on('change', changeCallback);
}

exports.watch = watchExe;

// 判断font文件夹是否存在
var checkFontExist = function(path) {
    var lineLastIndex = path.lastIndexOf('/');
    var fileName = path.substring(lineLastIndex + 1);
    if (fileName.lastIndexOf('.') != -1) {
        fileName = fileName.split('.')[0];
    }
    var url =  path.substring(0, lineLastIndex + 1) + 'font';

    fs.access(url, fs.F_OK, function(err) {
        if (!err) {

            readFileAndFilter(path, url, fileName);
        } else {
            // It isn't accessible
            logger.warn('文件夹font 没有建立');

            mkdirp(url, function (err) {
                if (err){
                    logger.error(err);
                } else {
                    readFileAndFilter(path, url, fileName);
                }
            });
        }
    });

}

/**
 * 读取文件，筛选内容
 * @param  {filePath} 模板路径
 * @param {url}    font字体生成文件夹地址
 * @param {fileName}    文件名字
 */
var readFileAndFilter = function(filePath, url, fileName) {
    var data = fs.readFileSync(filePath, 'utf-8');
    var jquery = fs.readFileSync(curDir + "/jquery.js", "utf-8");
    jsdom.env({
        html: data,
        src:[jquery],
        done: function(errors, window) {
            if (errors) {
                logger.error('读取文件错误');
                logger.error(errors);
            }
            var $= window.$;

            var fontObj = $('.J_benfont')
            var fontSpecs = fontObj.length;
            // 判断有几种字体
            if (fontSpecs == 0) {
                logger.warn('这个文件没有声明字体,请在模板添加一个或多个<input type="hidden" class="J_benfont" data-class="ben-font" value="syNormal">');
                return false;
            }
            fontObj.each(function(i) {
                var _this = $(this);
                var _className = _this.attr('data-class');
                var classAmount = $('.' + _className).length;
                var content = '';
                if (classAmount == 0) {
                    logger.warn('class ' + _className + ' 没有任何声明');
                } else {
                    $('.' + _className).each(function() {
                        content = content + $(this).text();
                    });
                    var contentArr = content.split('');
                    content = unique(contentArr).join('');

                    // 重命名字体名字
                    var reFontName = fileName + '_' + _this.val();
                    var fontpath = fontSrc + _this.val() + '.ttf';
                    fontGen(fontpath, content, url, reFontName);
                }
            });

        }
    });
}

/**
 * 生成字体
 * @param  {fontpath} 字体路径
 * @param {val}    转换内容
 * @param {destpath}  字体生成目标文件夹
 * @param {fontName}  字体名字
 */
var fontGen = function(fontpath, val, destpath, fontName) {
    var fontmin = new Fontmin()
    .src(fontpath)
    .use(rename(fontName + '.ttf'))
    .use(Fontmin.glyph({
        text: val
    }))
    .use(Fontmin.ttf2eot())
    .use(Fontmin.ttf2woff())
    .use(Fontmin.ttf2svg())
    .dest(destpath);
    fontmin.run(function(err, files) {
        if (err) {
            throw err;
            logger.error('生成字体错误');
            logger.error(err);
        } else {
            logger.info('生成字体 success');
        }
    });
}

/**
 * 数组去重
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
var unique = function(arr) {
    var result = [],
        hash = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!hash[arr[i]]) {
            result.push(arr[i]);
            hash[arr[i]] = true;
        }
    }
    return result;
}





