if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const d=e=>i(e,r),u={module:{uri:r},exports:o,require:d};s[r]=Promise.all(a.map((e=>u[e]||d(e)))).then((e=>(n(...e),o)))}}define(["./workbox-3e8df8c8"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/css/index-DYW8xFQo.css",revision:null},{url:"assets/js/game-core-CuGGpdt-.js",revision:null},{url:"assets/js/game-core-legacy-NujUixhw.js",revision:null},{url:"assets/js/index-CgRQu6qW.js",revision:null},{url:"assets/js/index-legacy-CSefTNtD.js",revision:null},{url:"assets/js/naive-ui-Bd6WkFNw.js",revision:null},{url:"assets/js/naive-ui-legacy-C4bypuH8.js",revision:null},{url:"assets/js/polyfills-legacy-NTIyd-kJ.js",revision:null},{url:"assets/js/vue-vendor--Sor-fzI.js",revision:null},{url:"assets/js/vue-vendor-legacy-8NXB3XlK.js",revision:null},{url:"avatar1.png",revision:"75637a790627dd9dfcb05d5212671aac"},{url:"avatar2.png",revision:"d01f262e44ac8db2745a4ba5ab589b37"},{url:"favicon.ico",revision:"9b44a998a38feb8b688b2814bfcaab6e"},{url:"index.html",revision:"075d4cf9ed8206c9aaede46dd9fba808"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"sounds/bgm.mp3",revision:"19d09f6d97661aaf3f7d650ff9965e42"},{url:"sounds/birthday.mp3",revision:"aa8705d4e9d8808eca70669c8defd31a"},{url:"sounds/buy.mp3",revision:"5aa66045105b2e5136e6e11728f8c227"},{url:"sounds/chance.mp3",revision:"eb44343d2f453d40d7ebd45db22c01f6"},{url:"sounds/click.mp3",revision:"520057c10863ca2e780ee8728ef43f56"},{url:"sounds/money.mp3",revision:"9864ac0bf7b62614346af49090eef7f3"},{url:"sounds/move.mp3",revision:"591be69de69c8080e109318982152a86"},{url:"sounds/roll.mp3",revision:"a0aeb8c63cd8306a868162b38327206b"},{url:"sounds/tax.mp3",revision:"e3b7a4caf6c310a80b98f65f874046a4"},{url:"sounds/win.mp3",revision:"1cf52fc6f0da1066562666c3a0aa3455"},{url:"avatar1.png",revision:"75637a790627dd9dfcb05d5212671aac"},{url:"avatar2.png",revision:"d01f262e44ac8db2745a4ba5ab589b37"},{url:"sounds/bgm.mp3",revision:"19d09f6d97661aaf3f7d650ff9965e42"},{url:"sounds/birthday.mp3",revision:"aa8705d4e9d8808eca70669c8defd31a"},{url:"sounds/buy.mp3",revision:"5aa66045105b2e5136e6e11728f8c227"},{url:"sounds/chance.mp3",revision:"eb44343d2f453d40d7ebd45db22c01f6"},{url:"sounds/click.mp3",revision:"520057c10863ca2e780ee8728ef43f56"},{url:"sounds/money.mp3",revision:"9864ac0bf7b62614346af49090eef7f3"},{url:"sounds/move.mp3",revision:"591be69de69c8080e109318982152a86"},{url:"sounds/roll.mp3",revision:"a0aeb8c63cd8306a868162b38327206b"},{url:"sounds/tax.mp3",revision:"e3b7a4caf6c310a80b98f65f874046a4"},{url:"sounds/win.mp3",revision:"1cf52fc6f0da1066562666c3a0aa3455"},{url:"manifest.webmanifest",revision:"1879b03f4183d451a9ac7f81204473e5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
