!function(){"use strict";var e,t,n,r,f,a={},c={};function o(e){var t=c[e];if(void 0!==t)return t.exports;var n=c[e]={id:e,loaded:!1,exports:{}};return a[e].call(n.exports,n,n.exports,o),n.loaded=!0,n.exports}o.m=a,o.c=c,e=[],o.O=function(t,n,r,f){if(!n){var a=1/0;for(d=0;d<e.length;d++){n=e[d][0],r=e[d][1],f=e[d][2];for(var c=!0,i=0;i<n.length;i++)(!1&f||a>=f)&&Object.keys(o.O).every((function(e){return o.O[e](n[i])}))?n.splice(i--,1):(c=!1,f<a&&(a=f));if(c){e.splice(d--,1);var u=r();void 0!==u&&(t=u)}}return t}f=f||0;for(var d=e.length;d>0&&e[d-1][2]>f;d--)e[d]=e[d-1];e[d]=[n,r,f]},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,{a:t}),t},n=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},o.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var f=Object.create(null);o.r(f);var a={};t=t||[null,n({}),n([]),n(n)];for(var c=2&r&&e;"object"==typeof c&&!~t.indexOf(c);c=n(c))Object.getOwnPropertyNames(c).forEach((function(t){a[t]=function(){return e[t]}}));return a.default=function(){return e},o.d(f,a),f},o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.f={},o.e=function(e){return Promise.all(Object.keys(o.f).reduce((function(t,n){return o.f[n](e,t),t}),[]))},o.u=function(e){return"assets/js/"+({53:"935f2afb",121:"7d9b5b04",235:"2a865436",533:"b2b675dd",630:"30931a0c",634:"5b14663e",970:"1bcaae5b",1477:"b2f554cd",1713:"a7023ddc",1800:"49f109f2",2243:"076d7db8",2535:"814f3328",2773:"c9fcbca1",2917:"8c962678",3089:"a6aa9e1f",3237:"1df93b7f",3260:"63a180cb",3394:"3e1bea14",3452:"13b4f215",3528:"0171cf6f",3608:"9e4087bc",4006:"375aa4e6",4013:"01a85c17",4062:"7818b736",4461:"3d054cdd",4522:"3feca493",5130:"cb363684",5241:"bc3689ea",5355:"7850374d",5814:"ea169ed9",5960:"14860564",6021:"60ce1365",6103:"ccc49370",6129:"65a3386c",6239:"6473c948",6968:"5cff5ba5",7093:"08595e6a",7668:"3b5d97d7",7673:"9835e848",7918:"17896441",8426:"bd58962e",8506:"11ff38f2",8610:"6875c492",8864:"1e164f0b",9164:"0188490e",9514:"1be78505",9581:"07b1573c",9948:"ad7e248f"}[e]||e)+"."+{53:"7ced7ea4",121:"3fcb4d98",235:"15982610",533:"c0583287",630:"61f354c4",634:"eaee1a73",970:"55ef003e",1477:"166cd8c3",1713:"c764be92",1800:"6bfc1912",2243:"03a8acee",2535:"0c313da4",2689:"5260e16a",2773:"9acead7f",2917:"6b704bb5",3089:"6d70e0eb",3237:"b29d0057",3260:"9a61f17d",3394:"938819b7",3452:"4acc49d4",3528:"35e87a4e",3608:"b0569190",4006:"e3aebb86",4013:"94bca56f",4062:"ee89b392",4461:"ccbfc181",4522:"4dd90f51",4608:"874e3a44",5130:"b460d2a0",5241:"22d39316",5355:"adaff90b",5460:"ef4d0b55",5814:"0f514e2d",5960:"80cd9aaa",6021:"0d47a659",6103:"b730cf55",6129:"34fb3ba2",6239:"86c0f42a",6968:"4ab0b463",7093:"456b2bef",7668:"154e9c40",7673:"bb0deb25",7918:"726c2854",8426:"cd8b398c",8506:"b32d71cd",8610:"35064b26",8864:"89e9602b",9164:"39b8703b",9514:"f6a9ddec",9581:"aa233957",9948:"15e2f2b8"}[e]+".js"},o.miniCssF=function(e){},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r={},f="russian-national-digital-archive-ruarxive:",o.l=function(e,t,n,a){if(r[e])r[e].push(t);else{var c,i;if(void 0!==n)for(var u=document.getElementsByTagName("script"),d=0;d<u.length;d++){var b=u[d];if(b.getAttribute("src")==e||b.getAttribute("data-webpack")==f+n){c=b;break}}c||(i=!0,(c=document.createElement("script")).charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.setAttribute("data-webpack",f+n),c.src=e),r[e]=[t];var l=function(t,n){c.onerror=c.onload=null,clearTimeout(s);var f=r[e];if(delete r[e],c.parentNode&&c.parentNode.removeChild(c),f&&f.forEach((function(e){return e(n)})),t)return t(n)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:c}),12e4);c.onerror=l.bind(null,c.onerror),c.onload=l.bind(null,c.onload),i&&document.head.appendChild(c)}},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.p="/",o.gca=function(e){return e={14860564:"5960",17896441:"7918","935f2afb":"53","7d9b5b04":"121","2a865436":"235",b2b675dd:"533","30931a0c":"630","5b14663e":"634","1bcaae5b":"970",b2f554cd:"1477",a7023ddc:"1713","49f109f2":"1800","076d7db8":"2243","814f3328":"2535",c9fcbca1:"2773","8c962678":"2917",a6aa9e1f:"3089","1df93b7f":"3237","63a180cb":"3260","3e1bea14":"3394","13b4f215":"3452","0171cf6f":"3528","9e4087bc":"3608","375aa4e6":"4006","01a85c17":"4013","7818b736":"4062","3d054cdd":"4461","3feca493":"4522",cb363684:"5130",bc3689ea:"5241","7850374d":"5355",ea169ed9:"5814","60ce1365":"6021",ccc49370:"6103","65a3386c":"6129","6473c948":"6239","5cff5ba5":"6968","08595e6a":"7093","3b5d97d7":"7668","9835e848":"7673",bd58962e:"8426","11ff38f2":"8506","6875c492":"8610","1e164f0b":"8864","0188490e":"9164","1be78505":"9514","07b1573c":"9581",ad7e248f:"9948"}[e]||e,o.p+o.u(e)},function(){var e={1303:0,532:0};o.f.j=function(t,n){var r=o.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else if(/^(1303|532)$/.test(t))e[t]=0;else{var f=new Promise((function(n,f){r=e[t]=[n,f]}));n.push(r[2]=f);var a=o.p+o.u(t),c=new Error;o.l(a,(function(n){if(o.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var f=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;c.message="Loading chunk "+t+" failed.\n("+f+": "+a+")",c.name="ChunkLoadError",c.type=f,c.request=a,r[1](c)}}),"chunk-"+t,t)}},o.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,f,a=n[0],c=n[1],i=n[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(i)var d=i(o)}for(t&&t(n);u<a.length;u++)f=a[u],o.o(e,f)&&e[f]&&e[f][0](),e[f]=0;return o.O(d)},n=self.webpackChunkrussian_national_digital_archive_ruarxive=self.webpackChunkrussian_national_digital_archive_ruarxive||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}()}();