# frontend-scaffold
Development routine automated with [gulp](https://github.com/gulpjs/gulp)


## Preprocessors
* Stylus for stylesheets;
* Jade template engine for HTML markup;
* CoffeeScript for JavaScript.


## Features
* Sourcemaps for scripts and stylesheets;
* Sprites generator (spritesheets or base64, retina).


## Preparation
Install dependencies:
```
npm install
```


## Usage

#### Directory structure

```
src
├── styles
├── templates
├── scripts
├── fonts
├── images
|   └── sprites
└── vendor
    ├── js
    ├── css
    └── img
```


#### Run tasks in development mode
```
gulp
```
Compiles app without html minification and starts development server with livereload on localhost:8080.
Compiled code stored in `dist` folder.


#### Run tasks in production mode
```
gulp prod
```
Compiles and minifies app code.
Compiled code stored in `build` folder.


## Notes

#### Sprites
For each subfolder of `src/images/sprites` with images in it will be generated spritesheet and stylesheet with classes `.icon-foldername` and `.icon-foldername-imgname` (for each image in folder).
To add the icon into a web page just add an element with `class="icon-foldername icon-foldername-imgname"` in your templates.

Folders naming rules:
* `foldername` – spritesheet and stylesheet will be genereted.
* `foldername@2x` – spritesheet and stylesheet will be generated for both regular and retina resolutions. Source images must be retina-sized.
* `foldername-base64` – images will be base64-encoded and inserted into a stylesheet.
* `foldername-base64@2x` – both regular and retina sized images will be base64-encoded and inserted into a stylesheet (I don't recommend to use this option, because browsers must load images in both resolutions in this case. Use second option instead).

Also there is possibility of gulp crash when trying to rename subfolder of `src/images/sprites` while gulp is watching (due to [this issue](https://github.com/shama/gaze/issues/114)). There is nothing to do except of waiting until gulp updates.
