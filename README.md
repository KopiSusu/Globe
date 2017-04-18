# Attrition

Toy / Interactive conceptual art in JavaScript, built with [three.js](https://threejs.org) and WebGL.

When you visit the world of [Attrition](http://attrition.xianny.com), you are assigned standing armies in a few random places on the globe. Where you start is an accident of birth, if you will. Click on other countries (either in the sidebar, or on the globe) to select them. You have one action available, and that is to move troops around. At the end of each turn (5 seconds, watch the timer!) all armies (from different players) who happen to be in the same country eliminate each other one-for-one. We designed Attrition to be impersonal, boring, and zero-sum - much like modern warfare. 

Unfortunately, our execution was time constrained, so this project is languishing in proof-of-concept stage with no further development anticipated.


## Notes / Todo
We built this game roughly seven weeks into learning how to code, and there are a bunch of things that are not the greatest. In a perfect world we would fix some of these things:

* the game is slow to load
  * compress moon images
  * minify production.js and maybe other js files
  * simplify some of the rendering code in /public/js
  * find a simpler way to represent country contour data (we are currently using a lot of lat-long coordinates
* some tests would be nice :(
* clumsy UI
  * add some explanatory tooltips
  * use tab to move between countries
* as a commentary on modern conflict, the game really doesn't mean much without a social element i.e. chat feature
* we also think it would be more interesting if armies don't magically vanish after their players have disconnected

## Getting Started

This project is currently running at [http://attrition.xianny.com]().
An older version (with different graphics) is at [http://kopisusu.github.io/Globe/]().

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

You'll need [Node.js](https://nodejs.org/en/download/package-manager/) and an [updated version of npm](https://docs.npmjs.com/getting-started/installing-node).

~~~~
$ node --version
v7.6.0
$ npm -v
4.1.2
~~~~

### Installing

`npm install`

### Running

`node server.js`

## Built With

* [expressjs](https://expressjs.com) - web framework
* [three.js](https://threejs.org/) - 3D modelling library
* [Grunt](https://gruntjs.com/) - JavaScript task runner

## Authors
* [Xianny Ng](http://xianny.com)
* [Komang Luce](https://github.com/KopiSusu)

## Acknowledgements
This project was built in our final weeks at Lighthouse Labs web development bootcamp. Many thanks to [Don Burks](https://donburks.com/) for his mentorship, and the many great teaching assistants at Lighthouse for their help, encouragement, and inspiration.
