var z=Object.defineProperty;var A=(n,t,e)=>t in n?z(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var r=(n,t,e)=>(A(n,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();class R{constructor(){r(this,"time",0);r(this,"shooting",!1);r(this,"target")}}const T=class T{constructor(){r(this,"outer",{pos:{x:0,y:0},radius:3});r(this,"nova",{pos:{x:0,y:0},radius:2});r(this,"inner",{pos:{x:0,y:0},radius:1});r(this,"mid",{pos:{x:0,y:0},radius:0})}};r(T,"placeholder",new T);let g=T;function x(n,t){return Math.hypot(t.pos.x-n.pos.x,t.pos.y-n.pos.y)}function S(n,t){const e=x(n,t),s=n.radius+t.radius;return e<s}function y(n,t){const e=t.pos.x-n.pos.x,s=t.pos.y-n.pos.y;return Math.atan2(s,e)}function O(n,t){const e=n.pos.x+Math.cos(t)*n.radius,s=n.pos.y+Math.sin(t)*n.radius;return{x:e,y:s}}const m=class m{constructor(){r(this,"pos",{x:0,y:0});r(this,"free",!0);r(this,"speed",m.normalSpeed);r(this,"target",g.placeholder.mid);r(this,"radius",0);r(this,"damage",0);r(this,"boundary",g.placeholder);r(this,"permeationTimer");r(this,"permeationInterval",m.defaultPermeationInterval)}start(t){if(!this.free)return;this.free=!1,this.target=t,delete this.permeationTimer,this.permeationInterval=m.defaultPermeationInterval*(1+Math.random());const e=Math.random()*Math.PI*2,s=Math.cos(e)*3,i=Math.sin(e)*3;this.radius=Math.random()*.05+.01,this.speed=Math.random()*.001-5e-4+m.normalSpeed,this.pos.x=s,this.pos.y=i,this.damage=0}draw(t){const{x:e,y:s,radius:i}=t.resolve(this);t.ctx.beginPath(),t.ctx.arc(e,s,i,0,Math.PI*2),t.ctx.closePath(),t.ctx.fillStyle=x(this,this.boundary.mid)+this.radius>this.boundary.inner.radius?"black":t.level.color,t.ctx.fill()}update(t){if(!this.permeationTimer&&S(this,this.boundary.inner)){const u=y(this.boundary.mid,this);this.pos.x=Math.cos(u)*(this.boundary.inner.radius+this.radius),this.pos.y=Math.sin(u)*(this.boundary.inner.radius+this.radius),this.permeationTimer=1;return}const e=this.permeationTimer?this.target:this.boundary.inner;if(this.permeationTimer&&this.permeationTimer<this.permeationInterval){this.permeationTimer+=t.time;return}let s=y(this,e);this.permeationTimer&&(s+=Math.PI/4);const i=x(this,this.boundary.mid),a=this.boundary.outer.radius-i,h=i>this.boundary.inner.radius?this.speed*t.time:this.speed/4*a*t.time;this.pos.x+=Math.cos(s)*h,this.pos.y+=Math.sin(s)*h}};r(m,"normalSpeed",.001),r(m,"defaultPermeationInterval",2e3);let P=m;class f{constructor(t){this.color=t}static initArray(){return[new f("#fdd"),new f("#ddf"),new f("#dfd"),new f("#fdf"),new f("#ffd"),new f("#dff")]}}const d=class d{constructor(t){r(this,"radius",d.defaultRadius);r(this,"speed",d.defaultSpeed);r(this,"energy",d.defaultEnergy);r(this,"shooting",!1);r(this,"target");r(this,"supernovaTimer");r(this,"supernovaInterval",1e3);r(this,"hasInteracted",!1);r(this,"pos",{x:0,y:0});r(this,"kills",0);this.boundary=t}start(){this.radius=d.defaultRadius,this.speed=d.defaultSpeed,this.energy=d.defaultEnergy,this.shooting=!1,delete this.target,delete this.supernovaTimer,this.hasInteracted=!1,this.pos.x=this.boundary.mid.pos.x,this.pos.y=this.boundary.mid.pos.y}draw(t){const{x:e,y:s,radius:i}=t.resolve(this);if(t.ctx.beginPath(),t.ctx.arc(e,s,i,0,Math.PI*2),t.ctx.closePath(),t.ctx.fillStyle=this.shooting&&this.radius<this.boundary.inner.radius?"red":"orange",t.ctx.fill(),!this.target||this.radius>this.boundary.inner.radius)return;const a=y(this,this.target),h=x(this,this.target),u=t.resolveRadius(h),l=t.resolve(this.target);t.ctx.beginPath();const o=(a-Math.PI/4)%(Math.PI*2),c=(a+Math.PI/4)%(Math.PI*2);t.ctx.arc(e,s,u,a,o,!0),t.ctx.moveTo(l.x,l.y),t.ctx.arc(e,s,u,a,c),t.ctx.moveTo(l.x,l.y),t.ctx.lineTo(e,s),t.ctx.moveTo(l.x,l.y),t.ctx.closePath(),t.ctx.lineWidth=4,t.ctx.setLineDash([4,64,4,96,4,192,4,352,4,576,4,864]),t.ctx.strokeStyle=this.shooting?"red":"white",t.ctx.stroke()}update(t){this.radius>this.boundary.inner.radius&&this.energy<0&&(this.energy=.1),this.updateRadius(t),!(this.supernovaTimer&&(this.supernovaTimer+=t.time,this.supernovaTimer<this.supernovaInterval))&&(this.shooting=t.shooting,this.shooting&&(this.hasInteracted=!0),this.updatePosition(t))}updatePosition(t){if(!this.target||(this.shooting&&(this.hasInteracted=!0),S(this.target,this)))return;let e=y(this,this.target);this.pos.x+=Math.cos(e)*this.speed*t.time,this.pos.y+=Math.sin(e)*this.speed*t.time;const s=x(this,this.boundary.mid),i=this.boundary.inner.radius-this.radius;s<=i||(e=y(this.boundary.mid,this),this.pos.x=Math.cos(e)*i,this.pos.y=Math.sin(e)*i)}updateRadius(t){this.radius>this.boundary.outer.radius||(this.radius=Math.max(d.defaultRadius,this.radius+this.energy*t.time*1e-5),!(this.radius<this.boundary.inner.radius)&&(this.supernovaTimer=1,this.hasInteracted=!1))}get targetAngle(){return this.target?y(this,this.target):0}drainEnergy(t){this.supernovaTimer||(this.energy=Math.min(1,this.energy+t.radius*3))}releaseEnergy(t){this.supernovaTimer||(this.energy=Math.max(-1,this.energy-t.radius))}shootAngles(t){const e=[this.targetAngle],s=Math.PI/20;for(let i=1;i<t;i++)e.push((this.targetAngle-s*i)%(Math.PI*2)),e.push((this.targetAngle+s*i)%(Math.PI*2));return e}};r(d,"defaultRadius",.1),r(d,"defaultSpeed",3e-4),r(d,"defaultEnergy",0);let E=d;class L{constructor(t,e,s,i=!1){r(this,"items",[]);r(this,"timer",0);this.size=t,this.Klass=e,this.interval=s,this.autoFill=i;for(let a=0;a<this.size;a++){const h=new e;i&&h.start(),this.items.push(h)}}get values(){return this.items.values()}get idle(){return this.items.every(t=>t.free)}get used(){let t=0;for(let e=0;e<this.items.length;e++)this.items[e].free||t++;return t}[Symbol.iterator](){return this.items.values()}getFree(t=1){return this.interval&&this.timer<this.interval?[]:(this.timer=0,this.getFreeImmediate(t))}getFreeImmediate(t=1){const e=[];for(let s=0;s<this.items.length&&!(this.items[s].free&&(e.push(this.items[s]),e.length>=t));s++);return e}updatePoolTimer(t){this.interval&&(this.timer+=t.time)}updateSize(t){for(this.size=t;this.items.length<this.size;){const e=new this.Klass;this.autoFill&&e.start(),this.items.push(e)}for(;this.items.length>this.size;)this.items.pop()}}const M=class M{constructor(){r(this,"pos",{x:0,y:0});r(this,"free",!0);r(this,"angle",0);r(this,"speed",6e-4);r(this,"radius",M.normalRadius);r(this,"boundary",g.placeholder)}start(t,e,s,i){this.free&&(this.free=!1,this.pos.x=t.x,this.pos.y=t.y,this.radius=e,this.angle=s,this.boundary=i)}draw(t){if(this.free)return;const{x:e,y:s,radius:i}=t.resolve(this);t.ctx.beginPath(),t.ctx.arc(e,s,i,0,Math.PI*2),t.ctx.closePath(),t.ctx.fillStyle="gold",t.ctx.fill()}update(t){if(this.free)return;this.pos.x+=Math.cos(this.angle)*this.speed*t.time,this.pos.y+=Math.sin(this.angle)*this.speed*t.time;const e=x(this,this.boundary.mid),s=this.boundary.inner.radius+this.radius;e>=s&&(this.free=!0)}};r(M,"normalRadius",.01);let v=M;class j{constructor(){r(this,"boundary",new g);r(this,"levels",f.initArray());r(this,"player");r(this,"enemies");r(this,"projectiles",new L(120,v,50));r(this,"levelIndex",0);r(this,"waveSize");this.waveSize=new URLSearchParams(location.search).has("easy")?4:40,this.enemies=new L(this.waveSize,P,100);let t;try{const e=localStorage.getItem("rundel-space-game");e&&(t=JSON.parse(e))}catch{}typeof t=="object"&&t!=null&&typeof t.levelIndex=="number"&&(this.levelIndex=t.levelIndex%this.levels.length),console.log(this.boundary),this.player=new E(this.boundary),this.player.start(),this.startLevel()}draw(t){this.drawOuter(t),this.drawInner(t),this.drawEnemies(t),this.drawProjectiles(t),this.player.draw(t),this.player.radius>=this.boundary.inner.radius&&this.drawSupernova(t),this.drawStats(t)}drawOuter(t){t.ctx.fillStyle=this.level.color,t.ctx.fillRect(0,0,t.width,t.height)}drawInner(t){const{x:e,y:s,radius:i}=t.resolve(this.boundary.inner);t.ctx.beginPath(),t.ctx.arc(e,s,i,0,Math.PI*2),t.ctx.closePath(),t.ctx.fillStyle="black",t.ctx.fill()}drawEnemies(t){for(const e of this.enemies)e.free||e.draw(t)}drawProjectiles(t){for(const e of this.projectiles)e.free||e.draw(t)}drawSupernova(t){t.ctx.font=`small-caps bold ${t.fontSize*2}px sans-serif`,t.ctx.fillStyle="rgba(0, 0, 0, 0.8)",t.ctx.textAlign="center";const e=t.half.width;let s=t.half.height;t.ctx.fillText("YOU WENT SUPERNOVA!",e,s),s+=t.fontSize*2.5,t.ctx.fillText("GAME OVER",e,s),s+=t.fontSize*2.5,this.player.supernovaTimer&&(this.player.supernovaTimer<this.player.supernovaInterval||t.ctx.fillText("SPAWN A NEW STAR [Space]",e,s))}drawStats(t){t.ctx.fillStyle="rgba(0, 0, 0, 0.5)",t.ctx.textBaseline="top",t.ctx.textAlign="left",t.ctx.font=`small-caps bold ${t.fontSize}px sans-serif`;const e=t.fontSize*.5;let s=t.fontSize*.5;t.ctx.fillText(`${this.deathFormatted}`,e,s),s+=t.fontSize*1.2,t.ctx.fillText(`LEVEL ${this.levelIndex}`,e,s),!this.player.supernovaTimer&&(s+=t.fontSize*1.2,t.ctx.fillText(`TARGETS ${this.enemies.used}`,e,s),s+=t.fontSize*1.2,t.ctx.fillText(`HITS ${this.player.kills}`,e,s))}update(t){this.updateProjectiles(t),this.updateEnemies(t),this.updatePlayer(t)}updateEnemies(t){this.enemies.updatePoolTimer(t);for(const e of this.enemies){if(e.free){this.player.radius>this.boundary.inner.radius&&this.player.radius<this.boundary.outer.radius&&e.start(this.player);continue}e.update(t),S(this.player,e)&&(this.player.drainEnergy(e),this.player.kills++,e.free=!0)}}updateProjectiles(t){this.projectiles.updatePoolTimer(t);for(const i of this.projectiles)if(!i.free){i.update(t);for(const a of this.enemies)if(!a.free&&S(a,i)){if(a.damage+=5e-4,this.player.energy<0&&(this.player.energy=0),a.damage<a.radius)continue;a.free=!0}}if(this.enemies.idle&&(this.levelIndex=(this.levelIndex+1)%this.levels.length,localStorage.setItem("rundel-space-game",JSON.stringify({levelIndex:this.levelIndex})),this.startLevel()),!this.player.target||!t.shooting||this.player.radius>this.boundary.inner.radius)return;const e=this.player.shootAngles(5),s=this.projectiles.getFree(5);for(let i=0;i<s.length;i++){const a=s[i];if(!a)break;const h=e[i],u=O(this.player,h);a.start(u,v.normalRadius,h,this.boundary)}}updatePlayer(t){this.player.update(t),this.player.supernovaTimer&&this.player.supernovaTimer>this.player.supernovaInterval&&this.player.hasInteracted&&this.player.radius>=this.boundary.nova.radius&&this.player.start()}get level(){return this.levels[this.levelIndex]}startLevel(){this.enemies.updateSize(this.waveSize*(this.levelIndex+1));for(const t of this.enemies)t.start(this.player)}get death(){return 5e5/(this.player.radius/this.boundary.inner.radius)}get deathFormatted(){const t=[{value:1e12,symbol:"TRILLION"},{value:1e9,symbol:"BILLION"},{value:1e6,symbol:"MILLION"}],e=this.death;for(const s of t)if(e>=s.value)return`${Math.floor(e/s.value).toLocaleString()} ${s.symbol} YEARS LEFT`;return`${Math.floor(e).toLocaleString()} YEARS LEFT`}}class F{constructor(t,e){r(this,"scale",0);r(this,"left",0);r(this,"top",0);r(this,"full",{width:0,height:0});r(this,"half",{width:0,height:0});r(this,"inner",{radius:0,left:0,top:0});r(this,"fontSize",0);this.ctx=t,this.game=e,this.resize()}resize(){let t=innerWidth,e=innerHeight-6;this.ctx.canvas.style.width=`${t}px`,this.ctx.canvas.style.height=`${e}px`,this.half.width=t,this.half.height=e,t*=2,e*=2,this.ctx.canvas.width=t,this.ctx.canvas.height=e,this.full.width=t,this.full.height=e;const s=.95;this.scale=Math.min(t,e)*s/2,[this.inner.left,this.inner.top]=t>e?[(t-e)/2*s,0]:[0,(e-t)/2*s],this.inner.radius=(t>e?e*s:t*s)/2,this.left=t/2,this.top=e/2,this.fontSize=Math.max(24,Math.min(96,24*this.scale/500))}resolve(t){return{x:this.half.width+this.scale*t.pos.x,y:this.half.height+this.scale*t.pos.y,radius:this.scale*t.radius}}resolveRadius(t){return this.scale*t}pointersToTarget([t,e]){if(!t)return;if(!e)return{pos:this.mouseToPos(t),radius:0};const s=t.time<e.time?t:e;return{pos:this.mouseToPos(s),radius:0}}mouseToPos(t){return{x:(t.x*2-this.half.width)/this.scale,y:(t.y*2-this.half.height)/this.scale}}get width(){return this.canvas.width}get height(){return this.canvas.height}get canvas(){return this.ctx.canvas}get level(){return this.game.level}}function N(){const n=canvas1.getContext("2d"),t=new j,e=new F(n,t);console.log(t),console.log(e);const s=new R,i=new Map,a=new Set;let h=0;function u(o){t.draw(e),s.time=o-h,h=o;const c=[...i.values()];s.shooting=a.has("Space")||i.size>1||i.size===1&&c[0].pressure>.3&&!("ontouchstart"in window),t.player.target=e.pointersToTarget(c),t.update(s),requestAnimationFrame(u)}requestAnimationFrame(u),n.canvas.addEventListener("pointerdown",o=>{const{pressure:c,x:I,y:b}=o;i.set(o.pointerId,{pressure:c,x:I,y:b,time:Date.now()})}),n.canvas.addEventListener("pointermove",o=>{const{pressure:c,x:I,y:b}=o,p=i.get(o.pointerId);p?(p.x=I,p.y=b,p.pressure=p.pressure,p.time??(p.time=Date.now())):i.set(o.pointerId,{pressure:c,x:I,y:b,time:Date.now()})}),n.canvas.addEventListener("pointerup",o=>{i.delete(o.pointerId)}),n.canvas.addEventListener("pointercancel",o=>{i.delete(o.pointerId)}),n.canvas.addEventListener("pointerleave",o=>{i.delete(o.pointerId)}),addEventListener("keydown",o=>{o.code==="Space"&&a.add("Space")}),addEventListener("keyup",o=>{o.code==="Space"&&a.delete("Space")}),addEventListener("blur",()=>{a.clear()}),addEventListener("focus",()=>{e.resize()}),addEventListener("resize",()=>{e.resize()}),addEventListener("orientationchange",()=>{e.resize()}),addEventListener("touchstart",l,{passive:!1}),addEventListener("touchmove",l,{passive:!1}),addEventListener("contextmenu",l,{passive:!1}),addEventListener("selectstart",l,{passive:!1}),addEventListener("selectionchange",l,{passive:!1});function l(o){o.preventDefault()}}addEventListener("load",()=>{N()});