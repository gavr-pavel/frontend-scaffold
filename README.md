# frontend-scaffold
Development routine automated with gulp


## Preprocessors
* Stylus for stylesheets;
* Jade template engine for HTML markup;
* CoffeeScript for JavaScript.


## Preparation

Install dependencies
```
npm install
```


## Usage

### Folder structure

```
src
├── fonts
├── images
├── scripts
├── styles
├── templates
└── vendor
    ├── js
    ├── css
    └── img
```


### Run tasks in development mode
```
gulp
```
Compiles app without minification and starts development server with livereload on localhost:8080
Compiled code stored in `dist` folder


### Run tasks in production mode
```
gulp prod
```
Compiles and minifies app and
Compiled code stored in `build` folder
