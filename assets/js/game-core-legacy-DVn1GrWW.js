System.register(["./vue-vendor-legacy-8NXB3XlK.js"],(function(e,t){"use strict";var a;return{setters:[e=>{a=e.G}],execute:function(){class t{static instance;animations=(()=>new Map)();static getInstance(){return t.instance||(t.instance=new t),t.instance}async movePlayer(e,t,a,i=500){const n=`player-${e.id}`,s=document.querySelector(`[data-player-id="${e.id}"]`);if(!s)return;this.animations.get(n)?.cancel(),s.classList.add("player-token-moving");const o=s.animate([{transform:"scale(1) translateY(0)"},{transform:"scale(1.2) translateY(-30px)"},{transform:"scale(1) translateY(0)"}],{duration:i,easing:"cubic-bezier(0.68, -0.55, 0.265, 1.55)"});return this.animations.set(n,o),new Promise((e=>{o.onfinish=()=>{s.classList.remove("player-token-moving"),this.animations.delete(n),e(!0)}}))}async showMoneyEffect(e,t,a){const i=document.createElement("div");i.className="money-effect",i.textContent=e>0?`+$${e}`:`-$${Math.abs(e)}`,i.style.cssText=`\n      position: fixed;\n      left: ${t}px;\n      top: ${a}px;\n      font-size: 24px;\n      font-weight: bold;\n      color: ${e>0?"#00A870":"#FF6B6B"};\n      pointer-events: none;\n      z-index: 1000;\n      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    `,document.body.appendChild(i);const n=i.animate([{transform:"translateY(0) scale(1)",opacity:1},{transform:"translateY(-50px) scale(1.2)",opacity:.8},{transform:"translateY(-100px) scale(1)",opacity:0}],{duration:1e3,easing:"cubic-bezier(0.4, 0, 0.2, 1)"});await n.finished,i.remove()}async showParticles(e,t,a){const i={money:["#00A870","#00D68F"],birthday:["#FF8FB1","#FFC2D4"],chance:["#7C5CFF","#9E85FF"]},n=Array.from({length:20},(()=>{const n=document.createElement("div");n.className=`particle ${a}`;const s=4+4*Math.random();return n.style.cssText=`\n        position: fixed;\n        left: ${e}px;\n        top: ${t}px;\n        width: ${s}px;\n        height: ${s}px;\n        background: ${i[a][Math.floor(2*Math.random())]};\n        border-radius: 50%;\n        pointer-events: none;\n        z-index: 1000;\n      `,document.body.appendChild(n),n})),s=n.map(((e,t)=>{const a=t/n.length*Math.PI*2,i=100+50*Math.random(),s=1e3+500*Math.random();return e.animate([{transform:"translate(0, 0) scale(1) rotate(0deg)",opacity:1},{transform:`translate(${Math.cos(a)*i}px, ${Math.sin(a)*i}px) scale(0) rotate(${360+360*Math.random()}deg)`,opacity:0}],{duration:s,easing:"cubic-bezier(0.4, 0, 0.2, 1)"})}));await Promise.all(s.map((e=>e.finished))),n.forEach((e=>e.remove()))}async showGlowEffect(e,t){const a=document.createElement("div");a.style.cssText=`\n      position: absolute;\n      inset: 0;\n      border-radius: inherit;\n      background: radial-gradient(circle at center, ${t}40 0%, transparent 70%);\n      pointer-events: none;\n      opacity: 0;\n    `,e.appendChild(a);const i=a.animate([{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1.2)"},{opacity:0,transform:"scale(1.5)"}],{duration:800,easing:"ease-out"});await i.finished,a.remove()}}const i=t.getInstance(),n=e("s",new class{sounds={};bgm=null;enabled=!0;bgmEnabled=!0;constructor(){this.initSounds(),this.initBGM()}initSounds(){Object.entries({roll:"./sounds/roll.mp3",move:"./sounds/move.mp3",buy:"./sounds/buy.mp3",money:"./sounds/money.mp3",chance:"./sounds/chance.mp3",birthday:"./sounds/birthday.mp3",tax:"./sounds/tax.mp3",win:"./sounds/win.mp3",lose:"./sounds/lose.mp3",click:"./sounds/click.mp3"}).forEach((([e,t])=>{const a=new Audio(t);a.preload="auto",this.sounds[e]=a}))}initBGM(){this.bgm=new Audio("/sounds/bgm.mp3"),this.bgm.loop=!0,this.bgm.volume=.3}play(e){if(!this.enabled)return;const t=this.sounds[e];t&&(t.currentTime=0,t.play().catch((()=>{})))}playBGM(){this.bgmEnabled&&this.bgm&&this.bgm.play().catch((()=>{}))}pauseBGM(){this.bgm&&this.bgm.pause()}toggleBGM(){return this.bgm&&(this.bgm.paused?(this.bgmEnabled=!0,this.bgm.play().catch((()=>{}))):(this.bgmEnabled=!1,this.bgm.pause())),this.bgmEnabled}toggle(){return this.enabled=!this.enabled,this.enabled}setEnabled(e){this.enabled=e}setBGMEnabled(e){this.bgmEnabled=e,e?this.playBGM():this.pauseBGM()}stop(e){const t=this.sounds[e];t&&(t.pause(),t.currentTime=0)}});e("u",a("game",{state:()=>{const e=localStorage.getItem("gameSettings"),t={players:[],currentPlayer:0,cells:[{id:0,type:"start",name:"起点",effect:"经过或停留获得2000"},{id:1,type:"property",name:"东大街",price:1e3},{id:2,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:3,type:"property",name:"西大街",price:1500},{id:4,type:"birthday",name:"生日惊喜",effect:"获得礼金1000"},{id:5,type:"property",name:"南大街",price:2e3},{id:6,type:"tax",name:"所得税",effect:"支付税金500"},{id:7,type:"property",name:"北大街",price:2500},{id:8,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:9,type:"property",name:"和平路",price:3e3},{id:10,type:"birthday",name:"蛋糕店",effect:"获得生日蛋糕"},{id:11,type:"property",name:"青年路",price:3500},{id:12,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:13,type:"property",name:"解放路",price:4e3},{id:14,type:"tax",name:"物业费",effect:"支付物业费800"},{id:15,type:"property",name:"中山路",price:4500},{id:16,type:"property",name:"人民路",price:5e3},{id:17,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:18,type:"property",name:"文化街",price:5500},{id:19,type:"birthday",name:"礼品店",effect:"获得生日礼物"},{id:20,type:"property",name:"科技路",price:6e3},{id:21,type:"tax",name:"维修费",effect:"支付维修费1200"},{id:22,type:"property",name:"商业街",price:6500},{id:23,type:"property",name:"金融街",price:7e3},{id:24,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:25,type:"property",name:"未来路",price:7500},{id:26,type:"birthday",name:"派对屋",effect:"举办生日派对"},{id:27,type:"property",name:"创新路",price:8e3},{id:28,type:"tax",name:"豪华税",effect:"支付豪华税1500"},{id:29,type:"property",name:"成功路",price:8500},{id:30,type:"chance",name:"机会",effect:"抽取机会卡片"},{id:31,type:"property",name:"财富路",price:9e3}],isGameStarted:!1,showDialog:!1,dialogContent:null,isGameOver:!1,winner:null,settings:{initialMoney:1e4,startBonus:2e3,cellCounts:{start:1,property:16,chance:6,birthday:4,tax:4},propertyMinPrice:1e3,propertyMaxPrice:9e3,taxAmount:500,birthdayBonus:1e3,chanceCards:[{effect:"获得酸奶一瓶",amount:0,type:"success",probability:10,oneTime:!0},{effect:"获得泡面一包",amount:0,type:"success",probability:10,oneTime:!0},{effect:"获得面包丁一包",amount:0,type:"success",probability:10,oneTime:!0},{effect:"获得瑞士卷一个",amount:0,type:"success",probability:10,oneTime:!0},{effect:"得大疆手机云台",amount:0,type:"success",probability:10,oneTime:!0},{effect:"中了彩票",amount:2e3,type:"success",probability:10},{effect:"手机维修",amount:-500,type:"warning",probability:10},{effect:"收到红包",amount:800,type:"success",probability:10},{effect:"请客吃饭",amount:-1e3,type:"warning",probability:10},{effect:"股票收益",amount:1500,type:"success",probability:10}],playerNames:["玩家1","玩家2","玩家3","玩家4"]},isMoving:!1};return e&&(t.settings=JSON.parse(e)),t},actions:{initGame(e,t=1e4){this.players=Array.from({length:e},((e,a)=>({id:a,name:this.settings.playerNames[a],position:0,money:t,color:["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4"][a]}))),this.isGameStarted=!0,this.isGameOver=!1,this.winner=null,this.currentPlayer=0,this.cells.forEach((e=>{"property"===e.type&&delete e.owner})),this.settings.chanceCards.forEach((e=>{e.used=!1})),n.playBGM()},async movePlayer(e){this.isMoving=!0;const t=this.players[this.currentPlayer],a=t.position;this.cells.length;const s=setInterval((()=>{n.play("roll")}),150);await new Promise((e=>setTimeout(e,800))),clearInterval(s);const o=[];let r=a;for(let i=1;i<=e;i++){let e;e=r<8?r+1:8===r?9:r>=9&&r<15?r+1:15===r?16:r>=16&&r<24?r+1:24===r?25:r>=25&&r<31?r+1:0,o.push(e),r=e}for(let c=0;c<o.length;c++){const e=o[c];if(t.position=e,n.play("move"),await new Promise((e=>setTimeout(e,500))),0===e&&31!==a){await new Promise((e=>setTimeout(e,300))),t.money+=2e3;const e=document.querySelector(`[data-player-id="${t.id}"]`);if(e){const t=e.getBoundingClientRect();await i.showMoneyEffect(2e3,t.left,t.top),await i.showParticles(t.left+t.width/2,t.top+t.height/2,"money")}n.play("money"),this.showMessage("经过起点","获得奖励 $2000！","success")}}await new Promise((e=>setTimeout(e,300))),await this.handleCellEffect(t),this.isMoving=!1,this.nextPlayer()},async handleCellEffect(e){const t=this.cells[e.position];if(!t)return;const a=document.querySelector(`[data-player-id="${e.id}"]`),s=a?.getBoundingClientRect();switch(t.type){case"birthday":e.money+=1e3,n.play("birthday"),s&&(await i.showMoneyEffect(1e3,s.left,s.top),await i.showParticles(s.left+s.width/2,s.top+s.height/2,"birthday")),this.showMessage("生日快乐！","获得礼金 $1000！","success");break;case"tax":const a=Number(t.effect?.match(/\d+/)?.[0])||500;e.money-=a,s&&await i.showMoneyEffect(-a,s.left,s.top),n.play("tax"),this.showMessage("缴纳税金",`支付税金 $${a}`,"warning");break;case"property":if(void 0===t.owner&&e.money>=(t.price||0))await new Promise((a=>{this.dialogContent={title:"购买房产",message:`是否购买 ${t.name}？价格：$${t.price}`,type:"info",action:()=>{this.buyProperty(t,e),this.closeDialog(),a()}},this.showDialog=!0;const i=this.closeDialog;this.closeDialog=()=>{i(),a()}}));else if(void 0!==t.owner&&t.owner!==e.id){const a=Math.floor(.3*(t.price||0)),i=1+.1*(this.cells.filter((e=>"property"===e.type&&e.owner===t.owner)).length-1),n=Math.floor(a*i);this.showMessage("支付租金",`需要支付租金 $${n}\n(基础租金：$${a} × ${i.toFixed(1)}倍)`,"warning"),await new Promise((e=>setTimeout(e,1500))),await this.payRent(e,t.owner,n)}break;case"chance":s&&await i.showParticles(s.left+s.width/2,s.top+s.height/2,"chance"),this.drawChanceCard(e)}await this.checkGameOver()},buyProperty(e,t){if(t.money>=(e.price||0)){t.money-=e.price||0,e.owner=t.id,n.play("buy");const a=document.querySelector(`[data-player-id="${t.id}"]`);if(a){const t=a.getBoundingClientRect();i.showMoneyEffect(-(e.price||0),t.left,t.top)}this.showMessage("购买成功",`你现在是 ${e.name} 的主人了！`,"success")}},async payRent(e,t,a){e.money-=a;const s=this.players.find((e=>e.id===t));if(s){s.money+=a;const o=document.querySelector(`[data-player-id="${e.id}"]`);if(o){const e=o.getBoundingClientRect();await i.showMoneyEffect(-a,e.left,e.top)}const r=document.querySelector(`[data-player-id="${t}"]`);if(r){const e=r.getBoundingClientRect();await i.showMoneyEffect(a,e.left,e.top)}n.play("money")}await this.checkGameOver()},async drawChanceCard(e){const t=this.settings.chanceCards.filter((e=>!e.used));t.reduce(((e,t)=>e+(t.probability||0)),0),n.play("chance"),await new Promise((e=>setTimeout(e,500)));const a=100*Math.random();let s=0,o=null;for(const i of t)if(s+=i.probability||0,a<=s){o=i;break}if(!o)return this.dialogContent={title:"机会卡",message:"无事发生鸭~",type:"info"},this.showDialog=!0,await new Promise((e=>setTimeout(e,1500))),void this.closeDialog();if(o.oneTime){const e=this.settings.chanceCards.find((e=>e.effect===o.effect));e&&(e.used=!0)}this.dialogContent={title:"机会卡",message:o.effect+(o.amount?`：${o.amount>0?"+":""}$${o.amount}`:""),type:o.type},this.showDialog=!0,await new Promise((e=>setTimeout(e,1500))),o.amount&&(e.money+=o.amount);const r=document.querySelector(`[data-player-id="${e.id}"]`);if(r){const e=r.getBoundingClientRect();o.amount&&(await i.showMoneyEffect(o.amount,e.left,e.top),n.play(o.amount>0?"money":"tax")),await i.showParticles(e.left+e.width/2,e.top+e.height/2,"chance")}this.closeDialog()},showMessage(e,t,a){this.dialogContent={title:e,message:t,type:a},this.showDialog=!0},closeDialog(){this.showDialog=!1,this.dialogContent=null},nextPlayer(){this.currentPlayer=(this.currentPlayer+1)%this.players.length},getPositionCoordinates(e){const t=this.cells.length;return e<9?{row:0,col:e}:e<16?{row:e-9+1,col:8}:e<25?{row:8,col:24-e}:{row:t-e,col:0}},needsCornerPath:(e,t)=>0===e.row&&8===t.col||8===e.col&&8===t.row||8===e.row&&0===t.col||0===e.col&&0===t.row,getCornerPath:(e,t)=>0===e.row&&8===t.col?[8]:8===e.col&&8===t.row?[16]:8===e.row&&0===t.col?[24]:0===e.col&&0===t.row?[0]:[],async checkGameOver(){const e=this.players.find((e=>e.money<=0));if(e){const t=[...this.players].sort(((e,t)=>t.money-e.money))[0];this.winner=t,this.isGameOver=!0,n.pauseBGM(),n.play("lose"),await new Promise((e=>setTimeout(e,500))),n.play("win"),await this.playGameOverAnimation(t,e),this.showGameOverDialog(t,e)}},async playGameOverAnimation(e,t){const a=this.players.map((e=>document.querySelector(`[data-player-id="${e.id}"]`))),n=a[e.id];if(n){n.animate([{transform:"scale(1) rotate(0deg)",filter:"brightness(1)"},{transform:"scale(1.5) rotate(360deg)",filter:"brightness(1.5)"}],{duration:1e3,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"});const e=n.getBoundingClientRect();await i.showParticles(e.left+e.width/2,e.top+e.height/2,"birthday")}const s=a[t.id];s&&s.animate([{transform:"scale(1) rotate(0deg)",opacity:1},{transform:"scale(0) rotate(-180deg)",opacity:0}],{duration:800,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"}),a.forEach(((a,i)=>{i!==e.id&&i!==t.id&&a&&a.animate([{transform:"scale(1)",opacity:1},{transform:"scale(0.8)",opacity:.6}],{duration:500,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"})})),await new Promise((e=>setTimeout(e,1500)))},showGameOverDialog(e,t){this.dialogContent={title:"游戏结束！",message:`${t.name} 破产了！\n${e.name} 以 $${e.money.toLocaleString()} 的资产获得胜利！`,type:"success",action:()=>{this.isGameStarted=!1,this.isGameOver=!1,this.winner=null,this.players=[],this.currentPlayer=0,this.cells.forEach((e=>{"property"===e.type&&delete e.owner}))},props:{style:{position:"fixed",top:"20px",left:"50%",transform:"translateX(-50%)",zIndex:2e3}}},this.showDialog=!0},updateSettings(e){this.settings={...e},localStorage.setItem("gameSettings",JSON.stringify(e)),this.cells=this.generateCells(e),this.isGameStarted&&this.players.forEach((t=>{t.money=e.initialMoney}))},generateCells(e){const t=[];let a=0;const i=["东大街","西大街","南大街","北大街","和平路","青年路","解放路","中山路","人民路","文化街","科技路","商业街","金融街","未来路","创新路","成功路","幸福路","希望街","阳光路","彩虹街","星光路","月亮街","银河路","梦想街","自由路","欢乐街","友谊路","和谐街","繁华路","富贵街","吉祥路","如意街"].sort((()=>Math.random()-.5));let n=0;t.push({id:a++,type:"start",name:"起点",effect:`经过或停留获得${e.startBonus}`});const s=32-e.cellCounts.start,o=Math.floor(s/e.cellCounts.property),r=Math.floor(s/e.cellCounts.chance),c=Math.floor(s/e.cellCounts.birthday),l=Math.floor(s/e.cellCounts.tax);for(let p=1;p<32;p++){let s;if(p%o==0&&t.filter((e=>"property"===e.type)).length<e.cellCounts.property){const o=Math.floor(e.propertyMinPrice+(e.propertyMaxPrice-e.propertyMinPrice)*(t.filter((e=>"property"===e.type)).length/e.cellCounts.property));s={id:a++,type:"property",name:i[n++],price:o}}else if(p%r==0&&t.filter((e=>"chance"===e.type)).length<e.cellCounts.chance)s={id:a++,type:"chance",name:"机会",effect:"抽取机会卡片"};else if(p%c==0&&t.filter((e=>"birthday"===e.type)).length<e.cellCounts.birthday)s={id:a++,type:"birthday",name:"生日惊喜",effect:`获得礼金${e.birthdayBonus}`};else if(p%l==0&&t.filter((e=>"tax"===e.type)).length<e.cellCounts.tax)s={id:a++,type:"tax",name:"税收",effect:`支付税金${e.taxAmount}`};else{const o=Math.floor(e.propertyMinPrice+(e.propertyMaxPrice-e.propertyMinPrice)*(t.filter((e=>"property"===e.type)).length/e.cellCounts.property));s={id:a++,type:"property",name:i[n++],price:o}}t.push(s)}return t}},getters:{currentPlayerData:e=>e.players[e.currentPlayer],isCurrentPlayersTurn:e=>!!e.isGameStarted&&!e.isGameOver&&!e.isMoving}}))}}}));