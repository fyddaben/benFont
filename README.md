# benFont

> 基于[fontmin](http://www.npmjs.com/package/fontmin)可以针对不同的项目，字体生成使用


### 特点

- 支持同个页面多个字体
- 支持选择器，过滤生成特定字体

### 安装

> 在package.json中，添加benfont

```
npm install
```

## 引入 

```
var benfont = require('benfont');
benfont.watch('../product/**/*.tpl');
```
监听路径, 可以是相对或者绝对路径

### 使用

- 例如上面例子，是针对`../product/`下面的任意`tpl`文件，不限层级
- 还需要在`tpl`文件头部声明，使用字体，及`class`选择器名称，例如
- 在模板中，添加下面的标记后，就能在模板对应的路径，生成`font`文件夹，放置字体文件

```
<input type="hidden" class='J_benfont' data-class='ben-font' value='syNormal'>
```

- `data-class`为选择器名称，可以自定义
- `value`为字体名称，可以自行更改，但必须与`benFont`的`ttf`文件夹里面的字体名字保持一致(去掉`.ttf`后的名字)
- ttf 字体文件，请自行百度下载所需字体文件。
- 在`scss`文件中声明

```
@mixin fontBlock($name, $fontName) {
    font-family: $fontName;
    src: url("./font/" + $name + "_" + $fontName + ".eot");
    src:
    url("./font/" + $name + "_" + $fontName + ".eot?#font-spider") format('embedded-opentype'),
    url("./font/" + $name + "_" + $fontName + ".woff") format('woff'),
    url("./font/" + $name + "_" + $fontName + ".ttf") format('truetype'),
    url("./font/" + $name + "_" + $fontName + ".svg") format('svg');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    @include fontBlock('index', 'DINOffcPro-Cond');
}
.num-font{
    font-family: 'DINOffcPro-CondBold';
}
```
- `$name` 表示模板的名字，字体文件跟着模板生成的，所以需要传入模板的名字
- `$fontName` 表示`ttf`文件夹里面的字体名字。然后声明`font-family`的时候也要保持一致

#### 谢谢浏览ヾ(｡´･_●･`｡)☆
