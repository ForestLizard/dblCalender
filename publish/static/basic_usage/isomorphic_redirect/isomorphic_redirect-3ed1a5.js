webpackJsonp([11],{265:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(o,u){try{var i=t[o](u),c=i.value}catch(a){return void n(a)}return i.done?void e(c):Promise.resolve(c).then((function(e){r("next",e)}),(function(e){r("throw",e)}))}return r("next")})}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return new Promise(function(t){setTimeout(t,e)})}Object.defineProperty(t,"__esModule",{value:!0});var f=(function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}})(),s=n(205),p=r(s),l=(function(e){function t(){return u(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return c(t,e),f(t,[{key:"shouldComponentCreate",value:(function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a(1e3);case 2:return this.redirect("/"),e.abrupt("return",!1);case 4:case"end":return e.stop()}}),n,this)})));return e})()}]),t})(p["default"]);t["default"]=l}});