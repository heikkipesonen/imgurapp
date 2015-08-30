"use strict";angular.module("imgurapp",["angular-loading-bar","ngAnimate","ngCookies","ngTouch","ngSanitize","ui.router"]).constant("appConfig",{api:"https://api.imgur.com/3",client_id:"b84e33b2ff595f6",client_secret:"8ebf546494d982fdd5b9c4155218ab1ddd06cbbd",resource_url:"app/resources",backend_url:"http://himgur.herokuapp.com",nsfwFilter:!0}).config(["imgurApiProvider","appConfig",function(e,t){e.client_id=t.client_id,e.client_secret=t.client_secret}]).config(["backendServiceProvider","appConfig",function(e,t){e.url=t.backend_url}]).config(["cfpLoadingBarProvider",function(e){e.includeSpinner=!1}]).service("stateHistory",function(){this.lastResolved=null,this.setLastResolved=function(e,t){this.lastResolved={name:e.name,params:angular.extend({},t)}}}).run(["transitionManager","$rootScope","$timeout","$stateParams","stateHistory",function(e,t,i,a,n){e.setAnimationDirection(),t.showLoadScreen=!1;var r=null,o=null;t.$on("$stateChangeSuccess",function(e,l){o=l.name,n.setLastResolved(l,a),t.showLoadScreen=!1,i.cancel(r)}),t.$on("$stateChangeError",function(e,a){console.log(e,a,n),t.showLoadScreen=!1,i.cancel(r)}),t.$on("$stateChangeStart",function(a,n){r=i(function(){t.showLoadScreen=!0},200),"root.gallery.page"===o&&"root.gallery.image"===n.name?e.setAnimationDirection("down"):"root.gallery.image"===o&&"root.gallery.album"===n.name?e.setAnimationDirection("down"):"root.home"===o&&"root.feedback"!==n.name&&e.setAnimationDirection("down")}),document.body.addEventListener("touchmove",function(e){e.preventDefault()})}]),function(){function e(e,t,i,a,n,r,o,l,s,m){this.album=i,this.image=a,this.thumbnails=[],this.imageSize=m.getResizedImage(this.image,window.innerWidth*window.devicePixelRatio),s.set("up",{name:"root.gallery.image",params:{type:t.type,galleryId:t.galleryId,imageId:t.imageId}}),s.set("right",{name:"root.gallery.album",params:{type:t.type,galleryId:t.galleryId,imageId:t.imageId,albumImageId:r.id}}),s.set("left",{name:"root.gallery.album",params:{type:t.type,galleryId:t.galleryId,imageId:t.imageId,albumImageId:o.id}}),s.set("down",null)}e.$inject=["$state","$stateParams","album","albumImage","albumImagePosition","nextAlbumImage","prevAlbumImage","imgurApi","directionManager","imageSize"],e.prototype={},angular.module("imgurapp").controller("AlbumImageController",e)}(),function(){function e(e,t,i,a,n,r){this.name=e.type+"/"+e.galleryId,this.thumbnails=r,this.page=_.parseInt(e.galleryPage),this.next=i,this.prev=a;var o=i.split("/"),l=a.split("/");n.set("right",{name:"root.gallery.page",params:{type:o[0],galleryId:o[1],galleryPage:0}}),n.set("left",{name:"root.gallery.page",params:{type:l[0],galleryId:l[1],galleryPage:0}}),n.set("down",{name:"root.gallery.page",params:{type:e.type,galleryId:e.galleryId,galleryPage:this.page+1}}),this.page>0?n.set("up",{name:"root.gallery.page",params:{type:e.type,galleryId:e.galleryId,galleryPage:this.page-1}}):n.set("up",{name:"root.home",params:{}})}e.$inject=["$stateParams","galleryImages","nextGallery","prevGallery","directionManager","thumbnails"],e.prototype={},angular.module("imgurapp").controller("GalleryPageController",e)}(),function(){function e(e,t,i,a,n,r,o,l,s,m,c,g){var u=this;this.image=n,this.thumbnails=[],this.imageSize=g.getResizedImage(this.image,window.innerWidth*window.devicePixelRatio),this.commentsLoaded=!1,this.comments=[],this.commentLimit=10,this.loadingComments=!1,this.loadComments=function(){return u.commentsLoaded?!1:(this.loadingComments=!0,m.getComments(u.image.id).then(function(e){u.comments=e,u.comments.length>0&&a(function(){t.$broadcast("scroll.toAnimated",document.getElementById("image-comments"))},200)})["finally"](function(){u.commentsLoaded=!0,u.loadingComments=!1}))},this.showMoreComments=function(){this.commentLimit+=10},c.set("up",{name:"root.gallery.page",params:{galleryId:o.galleryId,type:o.type,page:o.galleryPage}}),c.set("right",{name:"root.gallery.image",params:{imageId:l.id}}),c.set("left",{name:"root.gallery.image",params:{imageId:s.id}}),c.set("down",null)}e.$inject=["$rootScope","$scope","$state","$timeout","image","imagePosition","$stateParams","nextImage","prevImage","imgurApi","directionManager","imageSize"],e.prototype={},angular.module("imgurapp").controller("ImageController",e)}(),function(){function e(){this.homeScroll={x:0,y:0},this.abortStateChange=function(){window.history.back()}}angular.module("imgurapp").controller("RootController",e)}(),function(){function e(e,t){this.next=e,this.prev=t,this.scroll={x:0,y:0}}e.$inject=["nextGallery","prevGallery"],e.prototype={},angular.module("imgurapp").controller("GalleryController",e)}(),function(){function e(e,t,i,a,n,r,o,l){var s=this;this.galleryGroups=a,this.actionDisabled=!1,this.config=o,this.forms={},this.formdata={feedback:{name:"",email:"",message:""}},this.disableAction=function(){this.actionDisabled=!0,t(function(){s.actionDisabled=!1},500)},this.gotoGallery=function(e){if(!this.actionDisabled){var t=n.getGalleryState(e);r.go(t.name,t.params),this.disableAction()}},this.toggleGalleryGroup=function(t,i){if(!this.actionDisabled){if(!t.active){var a=_.filter(this.galleryGroups,{active:!0});_.forEach(a,function(e){e.active=!1})}t.active=!t.active,t.active&&e.$broadcast("scroll.toAnimated",i.srcElement),this.disableAction()}},l.set("up"),l.set("down"),l.set("left"),l.set("right",{name:"root.feedback"})}e.$inject=["$scope","$timeout","galleries","galleryGroups","Utils","$state","appConfig","directionManager"],angular.module("imgurapp").controller("HomeController",e)}(),function(){function e(e,t){var i=this;this.form={},this.model={name:"",email:"",message:""},this.busy=!1,this.message="",this.submit=function(){return this.busy=!0,t.post("/feedback",this.model).then(function(e){i.message=e.ok===!0?"Message delivered.":"Message was not delivered, for some reason :/"},function(){i.message="Message was not delivered, check your inputs (email, etc) :|"})["finally"](function(){i.busy=!1})},e.set("left",{name:"root.home",params:{}}),e.set("up"),e.set("down"),e.set("right")}e.$inject=["directionManager","backendService"],angular.module("imgurapp").controller("FeedbackController",e)}(),angular.module("imgurapp").service("transitionManager",function(){angular.extend(this,{el:document.body,direction:"forward",prefix:"animation-direction-",directions:["forward","back","up","down"],setAnimationDirection:function(e){var t=this;this.direction=e||this.direction,_.forEach(this.directions,function(e){e===t.direction?t.el.classList.add(t.prefix+t.direction):t.el.classList.remove(t.prefix+e)})}})}),angular.module("imgurapp").provider("imgurApi",function(){this.url="https://api.imgur.com/3",this.client_id=null,this.client_secret=null,this.$get=["$http",function(e){function t(e){this.options=angular.extend({},e)}return t.prototype={thumbnails:[{name:"s",size:90},{name:"b",size:160},{name:"m",size:320,proportions:!0},{name:"l",size:640,proportions:!0},{name:"h",size:1024,proportions:!0}],findThumbnail:function(e){return this.thumbnails.reduce(function(t,i){return Math.abs(i.size-e)<Math.abs(t.size-e)?i:t})},findLargerThumbnail:function(e){var t=this.findThumbnail(e);for(var i in this.thumbnails)if(this.thumbnails[i].size>=e){t=this.thumbnails[i];break}return t},_get:function(t,i){return e({headers:{Authorization:"Client-ID "+this.options.client_id},method:i||"GET",url:this.options.url+"/"+t,cache:!0})},getTopics:function(){return e.get("/app/resources/topics.json").then(function(e){return e.data})},getGallery:function(e,t,i){return void 0===i&&(i=""),this._get("gallery/"+e+"/"+t+"/"+i).then(function(e){return e.data.data})},getTopic:function(e,t){return void 0===t&&(t=""),this._get("/topics/"+e+"/"+t).then(function(e){return e.data.data})},getAlbum:function(e){return this._get("album/"+e).then(function(e){return e.data.data})},getComments:function(e){return this._get("gallery/"+e+"/comments").then(function(e){return e.data.data})},getThumbnail:function(e,t){return e.indexOf("h.gif")>-1&&(e=e.replace("h.gif",".gif")),e.replace(/(\w+)(\.\w+)$/i,"$1"+t+"$2")}},new t({url:this.url,client_id:this.client_id,client_secret:this.client_secret})}]}),angular.module("imgurapp").provider("imageSize",function(){this.devicePixelRatio=window.devicePixelRatio,this.gutter=10,this.thumbnailRatio=.25,this.imageRatio=1,this.$get=["imgurApi",function(e){function t(e){this._gutter=e.gutter,this._devicePixelRatio=e.devicePixelRatio,this._thumbnailRatio=e.thumbnailRatio,this._imageRatio=e.imageRatio}return t.prototype={thumbnail:function(){return window.innerWidth*this._thumbnailRatio},image:function(){return window.innerWidth*this._imageRatio},gutter:function(){return this._gutter},getResizedImage:function(t,i){var a=null;if(!t.animated){var n=e.findThumbnail(i);if(t.height>t.width){var r=n.size/t.height*t.width,o=n.size/r;t.width/(t.height/1024)>=i&&(a=e.findThumbnail(t.width*o))}else a=n}return a}},new t(this)}]}),angular.module("imgurapp").service("favorites",function(){angular.extend(this,{items:[],add:function(e){this.items.indexOf(e)<0&&this.items.push(e)},remove:function(e){this.items.indexOf(e)>-1&&this.items.splice(this.items.indexOf(e),1)}})}),angular.module("imgurapp").service("directionManager",["$state",function(e){angular.extend(this,{up:null,left:null,right:null,down:null,set:function(e,t){return this[e]=t||null,this},get:function(e){return this[e]},isset:function(e){return null!==this[e]},go:function(t){this[t]&&e.go(this[t].name,this[t].params)}})}]),angular.module("imgurapp").provider("backendService",function(){this.url="",this.$get=["$http",function(e){function t(e){this.options=e,console.log(this)}return t.prototype={_send:function(t){return t.headers={"Content-Type":"application/json"},t.url=this.options.url+t.url,e(t).then(function(e){return e.data})},post:function(e,t){var i={method:"POST",url:e,data:t};return this._send(i)}},new t({url:this.url})}]}),angular.module("imgurapp").service("Utils",["$state","imgurApi","imageSize","$http","appConfig",function(e,t,i,a,n){angular.extend(this,{/**
		 * generate grid of images
		 * (C) joni
		 * @param  {array} images
		 * @return {array}        list of images
		 */
makeGrid:function(e){var a=this,n=[],r=4,o=0,l=i.thumbnail(),s=i.gutter(),m=function(e,t,i){n[t]||(n[t]=[!1,!1,!1,!1]),n[t][e]=i},c=function(e,t,i){for(var a=[],n=e;n<e+i.w;n++)for(var r=t;r<t+i.h;r++)a.push({x:n,y:r});return a},g=function(e,t,i,a){c(e,t,i).forEach(function(e){m(e.x,e.y,a)});for(var t=o;t<n.length&&n[t].every(function(e){return e});t++)o=t+1},u=function(e,t,i){return c(e,t,i).every(function(e){return n[e.y]&&n[e.y][e.x]?!1:!0})},d={items:[],height:0},h=window.devicePixelRatio,p={1:t.findThumbnail((l-s)*h),2:t.findThumbnail((2*l-s)*h)};return e.forEach(function(e){for(var t=0,i=o,m=a.getImageTileSize(e);;){if(!n[i]||u(t,i,m)){g(t,i,m,e.id),d.items.push({left:t*l+s/2,top:i*l+s/2,width:l*m.w-s,height:l*m.h-s,image:e,thumbnail:p[m.w>=m.h?m.w:m.h]});break}t++,t+m.w>r&&(t=0,i++)}}),d.height=n.length*l,d},getImageTileSize:function(e){var t={w:1,h:1};return e.width>1.5*e.height?t.w=2:e.height>1.5*e.width?t.h=2:e.width>2048&&e.height>2048&&(t.w=2,t.h=2),t},getCursor:function(e){return e.touches.length>0?{x:e.touches[0].pageX,y:e.touches[0].pageY,timeStamp:e.timeStamp}:{x:e.pageX,y:e.pageY,timeStamp:e.timeStamp}},findClosest:function(e,t){return e.reduce(function(e,i){return Math.abs(i-t)<Math.abs(e-t)?i:e})},getGalleryLink:function(t,i){var a=t.split("/");return e.href("root.gallery.page",{type:a[0],galleryId:a[1],galleryPage:i||"0"})},getGalleryState:function(e,t){var i=e.split("/");return{name:"root.gallery.page",params:{type:i[0],galleryId:i[1],galleryPage:t||"0"}}},getResource:function(e){return a.get(n.resource_url+"/"+e).then(function(e){return e.data})},nextItem:function(e,t){var i=e.indexOf(t);return i>-1?i<e.length-1?e[i+1]:e[0]:null},prevItem:function(e,t){var i=e.indexOf(t);return i>-1?i>0?e[i-1]:e[e.length-1]:null}})}]),angular.module("imgurapp").directive("slideList",["Utils",function(e){return{restrict:"A",link:function(t,i){function a(e){m&&(m.style.transform="translate("+g.x+"px,"+g.y+"px)",m.style["-webkit-transform"]="translate("+g.x+"px,"+g.y+"px)",m.style.transition=(e||0)+"ms")}function n(t){h=t.srcElement.getAttribute("slide-item"),null!==h&&(m=t.srcElement,c.x=0,c.y=0,g.x=0,g.y=0,s=e.getCursor(t),u=l.offsetWidth,d=!1)}function r(t){if(s&&m){var i=e.getCursor(t),n=i.x-s.x,r=i.y-s.y;c.x+=n,c.y+=r,d===!1&&(s&&Math.abs(c.x)>Math.abs(c.y)?d="x":s&&Math.abs(c.x)<Math.abs(c.y)&&(d="y")),d===h&&(t.stopPropagation(),t.preventDefault(),g.x="x"===d?g.x+=n:g.x,g.y="y"===d?g.y+=r:g.y,a(),s=i)}}function o(){g.x/u;s=!1,g.x=0,g.y=0,a(300)}var l=i[0],s=!1,m=!1,c={x:0,y:0},g={x:0,y:0},u=0,d=!1,h=null;l.addEventListener("touchstart",n),l.addEventListener("touchmove",r),l.addEventListener("touchend",o)}}}]),angular.module("imgurapp").directive("scrollY",["$timeout",function(e){return{restrict:"A",scope:{scrollY:"="},link:function(t,i){function a(e){return e.touches.length>0?{x:e.touches[0].pageX,y:e.touches[0].pageY}:{x:e.pageX,y:e.pageY}}function n(e,t,i,a){return e/=a/2,1>e?i/2*e*e+t:(e--,-i/2*(e*(e-2)-1)+t)}function r(e){s=l.offsetHeight,s<l.scrollHeight&&0===l.scrollTop?l.scrollTop=1:s<l.scrollHeight&&l.scrollTop===l.scrollHeight-s&&(l.scrollTop=l.scrollHeight-s-1),e.stopPropagation(),g=!1,m.x=0,m.y=0,c=a(e)}function o(e){if(e.touches.length>1)return void e.preventDefault();var t=a(e);m.x+=t.x-c.x,m.y+=t.y-c.y;var i=l.scrollTop>=l.scrollHeight-s-1&&m.y<0,n=l.scrollTop<2&&m.y>0;g===!1&&(Math.abs(m.y)>Math.abs(m.x)?g="y":Math.abs(m.y)<=Math.abs(m.x)&&(g="x")),"y"!==g||n||i||e.stopPropagation()}var l=i[0],s=0,m={x:0,y:0},c=!1,g=!1;e(function(){t.scrollY&&t.scrollY.y>0&&(l.scrollTop=t.scrollY.y)}),l.addEventListener("touchstart",r),l.addEventListener("touchmove",o),t.scrollY&&l.addEventListener("scroll",function(){t.scrollY.y=l.scrollTop}),t.$on("scroll.to",function(e,t){l.scrollTop=t}),t.$on("scroll.toAnimated",function(e,t){var i=Date.now(),a=500,r=t.offsetTop-l.scrollTop,o=function(){var e=Date.now()-i,s=n(e,r,-r,a);l.scrollTop=t.offsetTop-s,a>e?requestAnimationFrame(o):l.scrollTop=t.offsetTop};requestAnimationFrame(o)}),t.$on("$destroy",function(){l.removeEventListener("touchstart",r),l.removeEventListener("touchmove",o)})}}}]),angular.module("imgurapp").directive("layoutCenter",function(){return{restrict:"A",transclude:!0,template:'<div class="layout-inner-wrapper" ng-transclude></div>'}}),angular.module("imgurapp").directive("imageLoader",["imgurApi","appConfig",function(e,t){return{restrict:"A",scope:{imageLoader:"="},link:function(i,a,n){function r(){l.classList.remove("image-loading"),l.classList.add("image-ready"),"IMG"===l.nodeName?l.src=s.src:l.style["background-image"]="url("+s.src+")",s=null}function o(){var a=i.imageLoader;if(a.nsfw&&l.classList.add("image-nsfw"),t.nsfwFilter!==!0||a.nsfw!==!0){l.classList.add("image-loading"),l.classList.remove("image-ready"),s=new Image,s.onload=function(){r()},s.onerror=function(){r()};var o=a.link;s.src=/\.(gif|jpg|jpeg|png|gifv|mp4)$/i.test(o)?n.thumbnail&&""!==n.thumbnail?e.getThumbnail(o,n.thumbnail):o:null}else l.classList.add("image-ready"),l.classList.add("image-nsfw-blocked")}var l=a[0],s=null;o()}}}]),angular.module("imgurapp").directive("gridImage",["imgurApi","appConfig",function(e,t){return{restrict:"A",scope:{gridImage:"="},link:function(i,a){function n(){o.classList.remove("image-loading"),o.classList.add("image-ready"),"IMG"===o.nodeName?o.src=l.src:o.style["background-image"]="url("+l.src+")",l=null}function r(){var a=i.gridImage;a.image.nsfw&&o.classList.add("image-nsfw"),t.nsfwFilter!==!0||a.image.nsfw!==!0?(o.classList.add("image-loading"),o.classList.remove("image-ready"),l=new Image,l.onload=function(){n()},l.onerror=function(){n()},l.src=/\.(gif|jpg|jpeg|png)$/i.test(a.image.link)?a.thumbnail?e.getThumbnail(a.image.link,a.thumbnail.name):a.image.link:null):(o.classList.add("image-ready"),o.classList.add("image-nsfw-blocked")),o.style.position="absolute",o.style.left=a.left+"px",o.style.top=a.top+"px",o.style.width=a.width+"px",o.style.height=a.height+"px"}var o=a[0],l=null;r()}}}]).directive("imageGrid",function(){return{restrict:"A",scope:{imageGrid:"="},link:function(e,t){t.css("height",e.imageGrid.height+"px")},template:'<div class="image-grid"><a ng-href="{{::item.image.href}}"class="grid-image"grid-image="::item"ng-repeat="(itemIndex, item) in imageGrid.items track by itemIndex"></a></div>'}}),angular.module("imgurapp").directive("comments",function(){return{restrict:"A",scope:{comments:"=",limit:"="},controller:["$scope","$rootScope","$timeout",function(e,t,i){function a(){n=!0,r&&i.cancel(r),r=i(function(){n=!1},500)}var n=!1,r=!1;e.showChildren=function(e,i){n||(i.stopPropagation(),e.childrenVisible=!e.childrenVisible,e.childrenVisible&&t.$broadcast("scroll.toAnimated",i.srcElement),a())}}],template:'<div class="comment" ng-click="showChildren(comment, $event)" ng-repeat="(commentIndex, comment) in comments | limitTo : limit track by commentIndex"><div class="comment-author" ng-bind="::comment.author"></div><div class="comment-comment" ng-bind="::comment.comment"></div><div class="comment-children-count" ng-bind="::\'replies: \'+comment.children.length"></div><div class="comment-children-pointer" ng-show="comment.childrenVisible && comment.children.length > 0"></div><div class="comment comment-child comment-animate" ng-click="showChildren($event)" ng-if="comment.childrenVisible" ng-repeat="(childIndex, child) in comment.children track by childIndex"><div class="comment-author" ng-bind="::child.author"></div><div class="comment-comment" ng-bind="::child.comment"></div><div class="comment-children-count" ng-bind="::\'replies: \'+child.children.length"></div></div></div>'}}),angular.module("imgurapp").factory("Grid",function(){/**
		 * generate grid of images
		 * (C) joni
		 * @param  {array} images
		 * @return {array}        list of images
		 */
function e(e,t,i){var a=[],n=4,r=0,o=function(e,t,i){a[t]||(a[t]=[!1,!1,!1,!1]),a[t][e]=i},l=function(e,t,i){for(var a=[],n=e;n<e+i.w;n++)for(var r=t;r<t+i.h;r++)a.push({x:n,y:r});return a},s=function(e,t,i,n){l(e,t,i).forEach(function(e){o(e.x,e.y,n)});for(var t=r;t<a.length&&a[t].every(function(e){return e});t++)r=t+1},m=function(e,t,i){return l(e,t,i).every(function(e){return a[e.y]&&a[e.y][e.x]?!1:!0})},c={items:[],height:0};return _.forEach(e,function(e){for(var o=0,l=r,g=e.size;;){if(!a[l]||m(o,l,g)){s(o,l,g,e.id),c.items.push({left:o*t+i/2,top:l*t+i/2,width:t*g.w-i,height:t*g.h-i,item:e});break}o++,o+g.w>n&&(o=0,l++)}}),c.height=a.length*t,c}return e}),function(){function e(e,t,i,a,n,r,o,l){this.options={changeVelocity:.8,changeDragDistance:.3,minimumDragDistance:60,tension:.3,leaveAnimationDuration:400,returnAnimationDuration:400},this.$timeout=a,this.Utils=l,this.$scope=e,this.directionManager=o,this.transitionManager=r,this.el=t[0],this.offset={x:0,y:0},this.delta={x:0,y:0},this.lastEvent=!1,this.width=null,this.height=null,this.direction=null,this.timer=!1,this.velocity={x:0,y:0};var s=this;this.setPosition(),this.el.addEventListener("touchstart",function(e){s.dragStart(e)}),this.el.addEventListener("touchmove",function(e){s.dragMove(e)}),this.el.addEventListener("touchend",function(e){s.dragEnd(e)})}e.$inject=["$scope","$element","$q","$timeout","$state","transitionManager","directionManager","Utils"],e.prototype={setPosition:function(e){this.el.style.transition=e?e+"ms":"",this.el.style.transform="translate3d("+this.offset.x+"px,"+this.offset.y+"px,0)",this.el.style["-webkit-transform"]="translate3d("+this.offset.x+"px,"+this.offset.y+"px,0)"},getExposedSide:function(){var e=null;return"y"===this.direction?e=this.delta.y>0?"up":this.delta.y<0?"down":null:"x"===this.direction&&(e=this.delta.x>0?"left":this.delta.x<0?"right":null),e},endTimer:function(){this.timer&&this.$timeout.cancel(this.timer)},startTimer:function(e){var t=this;return this.endTimer(),this.timer=this.$timeout(function(){t.$scope.$emit("drag.hold."+t.getExposedSide())},e||500),this.timer},dragStart:function(e){this.width=this.el.offsetWidth,this.height=this.el.offsetHeight,this.lastEvent=this.Utils.getCursor(e),this.delta.x=0,this.delta.y=0,this.velocity.x=0,this.velocity.y=0,this.direction=null},dragMove:function(e){var t=this.Utils.getCursor(e);if(this.lastEvent){var i=t.x-this.lastEvent.x,a=t.y-this.lastEvent.y;if(this.velocity.x=i/(t.timeStamp-this.lastEvent.timeStamp),this.velocity.y=a/(t.timeStamp-this.lastEvent.timeStamp),this.delta.x+=i,this.delta.y+=a,null===this.direction&&Math.abs(this.delta.x)>Math.abs(this.delta.y)?this.direction="x":null===this.direction&&Math.abs(this.delta.y)>=Math.abs(this.delta.x)&&(this.direction="y"),null!==this.direction){e.stopPropagation(),e.preventDefault();var n=!this.directionManager.left&&i>0&&this.offset.x>0||!this.directionManager.right&&0>i&&this.offset.x<0?this.options.tension:1,r=!this.directionManager.up&&a>0&&this.offset.y>0||!this.directionManager.down&&0>a&&this.offset.y<0?this.options.tension:1;i*=n,a*=r,"x"===this.direction?((i>0&&this.offset.x>0||0>i&&this.offset.x<0)&&this.startTimer(),this.offset.x+=i):"y"===this.direction&&((a>0&&this.offset.y>0||0>a&&this.offset.y<0)&&this.startTimer(),this.offset.y+=a),this.setPosition()}this.lastEvent=t}else this.dragStart(e)},dragEnd:function(){this.endTimer(),this.lastEvent=!1;var e={x:this.offset.x/this.width,y:this.offset.y/this.height};if(Math.abs(this.offset.x)>this.options.minimumDragDistance||Math.abs(this.offset.y)>this.options.minimumDragDistance){if(Math.abs(e.y)>this.options.changeDragDistance||Math.abs(this.velocity.y)>this.options.changeVelocity){if(e.y<0&&this.directionManager.down)return this.transitionManager.setAnimationDirection("down"),this.directionManager.go("down"),this.offset.y=-this.height,void this.setPosition(this.options.leaveAnimationDuration);if(e.y>0&&this.directionManager.up)return this.transitionManager.setAnimationDirection("up"),this.directionManager.go("up"),this.offset.y=this.height,void this.setPosition(this.options.leaveAnimationDuration)}if(Math.abs(e.x)>this.options.changeDragDistance||Math.abs(this.velocity.x)>this.options.changeVelocity){if(e.x<0&&this.directionManager.right)return this.transitionManager.setAnimationDirection("forward"),this.directionManager.go("right"),this.offset.x=-this.width,void this.setPosition(this.options.leaveAnimationDuration);if(e.x>0&&this.directionManager.left)return this.transitionManager.setAnimationDirection("back"),this.directionManager.go("left"),this.offset.x=this.width,void this.setPosition(this.options.leaveAnimationDuration)}}this.velocity.x=0,this.velocity.y=0,this.offset.x=0,this.offset.y=0,this.setPosition(this.options.returnAnimationDuration)}},angular.module("imgurapp").controller("DragViewController",e).directive("dragView",function(){return{restrict:"A",controller:"DragViewController"}})}(),angular.module("imgurapp").config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("root",{"abstract":!0,resolve:{topics:["Utils",function(e){return e.getResource("topics.json")}],galleryGroups:["Utils",function(e){return e.getResource("galleries.json").then(function(t){return _.map(t,function(t){return t.items=_.map(t.items,function(t){return{src:"gallery/"+t,name:t,href:e.getGalleryLink(t,0)}}),t})})}],galleries:["galleryGroups",function(e){return _.flatten(e.map(function(e){return _.map(e.items,"name")}))}]},controller:"RootController",controllerAs:"Root",templateUrl:"app/views/root/root.view.html"}).state("root.home",{url:"/",templateUrl:"app/views/home/home.view.html",controller:"HomeController",controllerAs:"Home"}).state("root.feedback",{url:"/feedback",templateUrl:"app/views/forms/forms.feedback.html",controller:"FeedbackController",controllerAs:"Feedback"}).state("root.gallery",{url:"/:type/{galleryId:[a-zA-Z0-9-_]+}/{galleryPage:[0-9]+}",resolve:{galleryImages:["$stateParams","imgurApi",function(e,t){return t.getGallery(e.type,e.galleryId,e.galleryPage)}],nextGallery:["$stateParams","galleries","Utils",function(e,t,i){return i.nextItem(t,e.type+"/"+e.galleryId)}],prevGallery:["$stateParams","galleries","Utils",function(e,t,i){return i.prevItem(t,e.type+"/"+e.galleryId)}]},templateUrl:"app/views/gallery/gallery.view.html","abstract":!0,controller:"GalleryController",controllerAs:"Gallery"}).state("root.gallery.page",{url:"/gallery",resolve:{thumbnails:["galleryImages","$state","$stateParams","Utils",function(e,t,i,a){var n=e.map(function(e){return e.href=t.href("root.gallery.image",{type:i.type,galleryId:i.galleryId,galleryPage:i.galleryPage,imageId:e.id}),e});return a.makeGrid(n)}]},controller:"GalleryPageController",controllerAs:"GalleryPage",templateUrl:"app/views/gallery/page/gallery.page.view.html"}).state("root.gallery.image",{url:"/:imageId",resolve:{image:["galleryImages","$state","$stateParams","imgurApi","Utils",function(e,t,i,a,n){var r=_.find(e,{id:i.imageId});return r.is_album?a.getAlbum(r.id).then(function(e){var a=e.images.map(function(e){return e.href=t.href("root.gallery.album",{type:i.type,galleryId:i.galleryId,imageId:r.id,albumImageId:e.id}),e});return r.grid=n.makeGrid(a),r}):r}],imagePosition:["galleryImages","image",function(e,t){return{index:e.indexOf(t),count:e.length}}],nextImage:["galleryImages","image","Utils",function(e,t,i){return i.nextItem(e,t)}],prevImage:["galleryImages","image","Utils",function(e,t,i){return i.prevItem(e,t)}]},controller:"ImageController",controllerAs:"Image",templateUrl:"app/views/gallery/image/image.view.html"}).state("root.gallery.album",{url:"/:imageId/:albumImageId",controller:"AlbumImageController",controllerAs:"Album",templateUrl:"app/views/gallery/image/album/image.album.view.html",resolve:{album:["$stateParams","galleryImages","imgurApi",function(e,t,i){var a=_.find(t,{id:e.imageId});return a.images?a:i.getAlbum(e.imageId)}],albumImage:["$stateParams","album",function(e,t){return _.find(t.images,{id:e.albumImageId})}],albumImagePosition:["album","albumImage",function(e,t){return{index:e.images.indexOf(t),count:e.images.length}}],nextAlbumImage:["album","albumImage","Utils",function(e,t,i){return i.nextItem(e.images,t)}],prevAlbumImage:["album","albumImage","Utils",function(e,t,i){return i.prevItem(e.images,t)}]}}),t.otherwise("/")}]),angular.module("imgurapp").run(["$templateCache",function(e){e.put("app/views/forms/forms.feedback.html",'<div class="view view-background view-home-title"><h2 class="view-background-title view-gallery-title">Feedback</h2></div><div class="view" scroll-y=""><div class="view-gallery-title-offset"></div><div class="home-form form-wrapper view-colored"><p class="text-box">If you have any suggestions, ideas, even crazy ones, other than "i want to post comments", please submit those valuable productions of brainwavepatters (or lack of).</p><p class="text-box">Your feedback might be valuable or it might be ignored, maybe until it is not ignored, or cannot be ignored anymore and yet it might be that nothing is done about it, or could be that something would be done, but this might not be the case.</p><p class="text-box">btw: this application is a freetime project, do not take it too seriously.</p><form ng-submit="Feedback.submit(Feedback.form.feedback)" novalidate="true" name="Feedback.form.feedback" class="text-box"><div class="input-wrapper"><input type="text" name="name" ng-model="Feedback.model.name"> <span class="input-label">Name</span></div><div class="input-wrapper"><input type="email" name="email" ng-model="Feedback.model.email"> <span class="input-label">Email</span></div><div class="input-wrapper"><textarea name="message" ng-model="Feedback.model.message"></textarea> <span class="input-label">Message</span></div><p class="text-box text-hilight text-center" ng-show="Feedback.message" ng-bind="Feedback.message"></p><div class="form-controls text-center"><button class="icon-button small has-label" ng-class="{\'button-busy\' : Feedback.busy}"><i class="ion-ios-paperplane-outline"></i><div class="icon-button-label">send</div></button></div></form></div></div>'),e.put("app/views/gallery/gallery.view.html",'<ui-view class="view view-animate view-gallery-page" drag-view=""></ui-view>'),e.put("app/views/home/home.view.html",'<div class="view view-background view-gallery-title view-home-title"><h2 class="view-background-title view-gallery-title">Galleries</h2></div><div class="view" scroll-y="Root.homeScroll"><div class="view-gallery-title-offset"></div><div class="view-colored" slide-list=""><div class="text-center"><div class="icon-button small has-label" ng-class="{\'active\' : !Home.config.nsfwFilter}" ng-click="Home.config.nsfwFilter = !Home.config.nsfwFilter"><i class="ion-woman"></i><div class="icon-button-label">nsfw</div></div><div class="icon-button small has-label"><i class="ion-ios-plus-empty"></i><div class="icon-button-label">add new</div></div><div class="icon-button small has-label"><i class="ion-ios-search-strong"></i><div class="icon-button-label">search</div></div><div class="icon-button small has-label" ui-sref="root.feedback"><i class="ion-ios-email-outline"></i><div class="icon-button-label">feedback</div></div></div><div id="gallery-{{galleryGroupIndex}}" class="list-item home-list-gallery-group" ng-class="{\'item-open\' : galleryGroup.active}" ng-repeat="(galleryGroupIndex, galleryGroup) in Home.galleryGroups track by galleryGroupIndex"><h4 class="group-title-label" ng-click="Home.toggleGalleryGroup(galleryGroup, $event)" ng-bind="::galleryGroup.name"></h4><a ng-if="galleryGroup.active" class="list-item home-list-item list-item-animate" slide-item="x" ng-repeat="(galleryIndex, gallery) in galleryGroup.items track by galleryIndex" ng-bind="::gallery.name" ng-href="{{::gallery.href}}"></a></div></div></div>'),e.put("app/views/root/root.view.html",'<div ui-view="" class="view view-animate view-root" drag-view="" ng-class="{\'on-load\' : showLoadScreen}"></div>'),e.put("app/views/gallery/image/image.view.html",'<div class="view view-background"><h2 class="view-background-title view-image-title" ng-bind="::Image.image.title"></h2></div><div class="view view-image" scroll-y=""><div class="view-image-wrapper"><div class="view-image-title-offset"><h2 class="view-background-title view-image-title text-hidden" ng-bind="::Image.image.title"></h2></div><div class="container view-colored"><div ng-if="Image.image.grid" image-grid="Image.image.grid"></div><div ng-if="!Image.image.grid" class="image-full" thumbnail="{{Image.imageSize.name}}" image-loader="Image.image" style="height:0; padding-bottom: {{Image.image.height / Image.image.width * 100}}%"></div><p ng-if="::Image.image.description" class="text-box view-image-description" ng-bind="::Image.image.description"></p><p ng-if="::Image.image.account_url" class="view-image-user" ng-bind="::Image.image.account_url"></p></div><div class="text-center view-colored" ng-if="Image.image.comment_count"><div class="icon-button" ng-class="{\'button-busy\' : Image.loadingComments}" ng-click="Image.loadComments()"><i class="ion-ios-chatbubble-outline"></i></div></div></div><div id="image-comments" ng-if="Image.comments.length > 0 && Image.image.comment_count" comments="Image.comments" limit="Image.commentLimit" class="comment-animate"></div><div class="text-center view-colored" ng-if="Image.image.comment_count"><div class="icon-button" ng-show="Image.commentLimit < Image.comments.length" ng-click="Image.showMoreComments()"><i class="ion-ios-more-outline"></i></div></div></div>'),e.put("app/views/gallery/page/gallery.page.view.html",'<div class="view view-background view-gallery-title"><h4 class="view-background-pagenumber" ng-bind="GalleryPage.page+1"></h4><h2 class="view-background-title view-gallery-title" ng-bind="::GalleryPage.name"></h2></div><div class="view view-gallery" scroll-y="Gallery.scroll"><div class="view-gallery-title-offset"></div><div class="container view-colored"><div image-grid="GalleryPage.thumbnails"></div></div></div>'),e.put("app/views/gallery/image/album/image.album.view.html",'<div class="view view-background"><h2 class="view-background-title view-image-title" ng-bind="::Album.image.title || Album.album.title"></h2></div><div class="view view-image" scroll-y=""><div class="view-image-title-offset"><h2 class="view-background-title view-image-title text-hidden" ng-bind="::Album.image.title || Album.album.title"></h2></div><div class="container view-colored"><div class="image-full" thumbnail="{{Album.imageSize.name}}" image-loader="Album.image" style="height:0; padding-bottom: {{Album.image.height / Album.image.width * 100}}%"></div><p class="view-image-description" ng-if="::Album.image.description" ng-bind="::Album.image.description"></p><p class="view-image-user" ng-bind="::Album.album.account_url"></p></div></div>')}]);