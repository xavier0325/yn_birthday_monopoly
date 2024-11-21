import { defineStore } from 'pinia';
import { Player, Cell, GameStore, GameSettings } from '../types';
import { animationManager } from '../utils/animation';
import { soundManager } from '../utils/sound';

export const useGameStore = defineStore('game', {
  state: (): GameStore => {
    const savedSettings = localStorage.getItem('gameSettings');
    const defaultState: GameStore = {
      players: [],
      currentPlayer: 0,
      cells: [
        { id: 0, type: 'start', name: '起点', effect: '经过或停留获得2000' },
        { id: 1, type: 'property', name: '东大街', price: 1000 },
        { id: 2, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        { id: 3, type: 'property', name: '西大街', price: 1500 },
        { id: 4, type: 'birthday', name: '生日惊喜', effect: '获得礼金1000' },
        { id: 5, type: 'property', name: '南大街', price: 2000 },
        { id: 6, type: 'tax', name: '所得税', effect: '支付税金500' },
        { id: 7, type: 'property', name: '北大街', price: 2500 },
        { id: 8, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        
        { id: 9, type: 'property', name: '和平路', price: 3000 },
        { id: 10, type: 'birthday', name: '蛋糕店', effect: '获得生日蛋糕' },
        { id: 11, type: 'property', name: '青年路', price: 3500 },
        { id: 12, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        { id: 13, type: 'property', name: '解放路', price: 4000 },
        { id: 14, type: 'tax', name: '物业费', effect: '支付物业费800' },
        { id: 15, type: 'property', name: '中山路', price: 4500 },
        
        { id: 16, type: 'property', name: '人民路', price: 5000 },
        { id: 17, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        { id: 18, type: 'property', name: '文化街', price: 5500 },
        { id: 19, type: 'birthday', name: '礼品店', effect: '获得生日礼物' },
        { id: 20, type: 'property', name: '科技路', price: 6000 },
        { id: 21, type: 'tax', name: '维修费', effect: '支付维修费1200' },
        { id: 22, type: 'property', name: '商业街', price: 6500 },
        
        { id: 23, type: 'property', name: '金融街', price: 7000 },
        { id: 24, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        { id: 25, type: 'property', name: '未来路', price: 7500 },
        { id: 26, type: 'birthday', name: '派对屋', effect: '举办生日派对' },
        { id: 27, type: 'property', name: '创新路', price: 8000 },
        { id: 28, type: 'tax', name: '豪华税', effect: '支付豪华税1500' },
        { id: 29, type: 'property', name: '成功路', price: 8500 },
        { id: 30, type: 'chance', name: '机会', effect: '抽取机会卡片' },
        { id: 31, type: 'property', name: '财富路', price: 9000 },
      ],
      isGameStarted: false,
      showDialog: false,
      dialogContent: null,
      isGameOver: false,
      winner: null,
      settings: {
        initialMoney: 10000,
        startBonus: 2000,
        cellCounts: {
          start: 1,
          property: 16,
          chance: 6,
          birthday: 4,
          tax: 4,
        },
        propertyMinPrice: 1000,
        propertyMaxPrice: 9000,
        taxAmount: 500,
        birthdayBonus: 1000,
        chanceCards: [
          { effect: '获得酸奶一瓶', amount: 0, type: 'success', probability: 10, oneTime: true },
          { effect: '获得泡面一包', amount: 0, type: 'success', probability: 10, oneTime: true },
          { effect: '获得面包丁一包', amount: 0, type: 'success', probability: 10, oneTime: true },
          { effect: '获得瑞士卷一个', amount: 0, type: 'success', probability: 10, oneTime: true },
          { effect: '得大疆手机云台', amount: 0, type: 'success', probability: 10, oneTime: true },
          { effect: '中了彩票', amount: 2000, type: 'success', probability: 10 },
          { effect: '手机维修', amount: -500, type: 'warning', probability: 10 },
          { effect: '收到红包', amount: 800, type: 'success', probability: 10 },
          { effect: '请客吃饭', amount: -1000, type: 'warning', probability: 10 },
          { effect: '股票收益', amount: 1500, type: 'success', probability: 10 },
        ],
        playerNames: ['玩家1', '玩家2', '玩家3', '玩家4'],
      },
      isMoving: false,
    };

    if (savedSettings) {
      defaultState.settings = JSON.parse(savedSettings);
    }

    return defaultState;
  },
  
  actions: {
    initGame(playerCount: number, initialMoney: number = 10000) {
      this.players = Array.from({ length: playerCount }, (_, index) => ({
        id: index,
        name: this.settings.playerNames[index],
        position: 0,
        money: initialMoney,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index],
      }));
      
      this.isGameStarted = true;
      this.isGameOver = false;
      this.winner = null;
      this.currentPlayer = 0;
      
      this.cells.forEach(cell => {
        if (cell.type === 'property') {
          delete cell.owner;
        }
      });
      
      this.settings.chanceCards.forEach(card => {
        card.used = false;
      });

      // 开始播放背景音乐
      soundManager.playBGM();
    },
    
    async movePlayer(steps: number) {
      this.isMoving = true;
      const player = this.players[this.currentPlayer];
      const oldPosition = player.position;
      const totalCells = this.cells.length;
      
      // 播放骰子滚动音效
      const rollSound = () => {
        soundManager.play('roll');
      };
      
      // 在骰子滚动过程中多次播放音效
      const rollInterval = setInterval(rollSound, 150);
      await new Promise(resolve => setTimeout(resolve, 800)); // 等待骰子滚动动画
      
      // 停止骰子滚动音效
      clearInterval(rollInterval);
      
      // 计算移动路径
      const path: number[] = [];
      let currentPosition = oldPosition;
      
      for (let i = 1; i <= steps; i++) {
        let nextPosition;
        
        // 根据当前位置计算下一个位置
        if (currentPosition < 8) {
          // 在顶部行，向右移动
          nextPosition = currentPosition + 1;
        } else if (currentPosition === 8) {
          // 从顶部行转到右侧列
          nextPosition = 9;
        } else if (currentPosition >= 9 && currentPosition < 15) {
          // 在右侧列，向下移动
          nextPosition = currentPosition + 1;
        } else if (currentPosition === 15) {
          // 从右侧列转到底部行
          nextPosition = 16;
        } else if (currentPosition >= 16 && currentPosition < 24) {
          // 在底部行，向左移动
          nextPosition = currentPosition + 1;
        } else if (currentPosition === 24) {
          // 从底部行转到左侧列
          nextPosition = 25;
        } else if (currentPosition >= 25 && currentPosition < 31) {
          // 在左侧列，向上移动
          nextPosition = currentPosition + 1;
        } else {
          // 从左侧列回到起点
          nextPosition = 0;
        }
        
        path.push(nextPosition);
        currentPosition = nextPosition;
      }
      
      // 逐步移动并播放动画
      for (let i = 0; i < path.length; i++) {
        const nextPosition = path[i];
        player.position = nextPosition;
        
        // 播放移动音效
        soundManager.play('move');
        
        // 等待移动动画完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 如果经过起点，获得奖励
        if (nextPosition === 0 && oldPosition !== 31) {
          await new Promise(resolve => setTimeout(resolve, 300));
          player.money += 2000;
          const element = document.querySelector(`[data-player-id="${player.id}"]`);
          if (element) {
            const rect = element.getBoundingClientRect();
            await animationManager.showMoneyEffect(2000, rect.left, rect.top);
            await animationManager.showParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'money');
          }
          // 播放金钱音效
          soundManager.play('money');
          this.showMessage('经过起点', '获得奖励 $2000！', 'success');
        }
      }
      
      // 等待最后一步动画完成
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 处理最终格子效果
      await this.handleCellEffect(player);
      
      // 处理完所有效果后，结束移动状态并切换到下一个玩家
      this.isMoving = false;
      this.nextPlayer();
    },
    
    async handleCellEffect(player: Player) {
      const cell = this.cells[player.position];
      if (!cell) return;

      const element = document.querySelector(`[data-player-id="${player.id}"]`);
      const rect = element?.getBoundingClientRect();

      switch (cell.type) {
        case 'birthday':
          player.money += 1000;
          // 播放生日音效
          soundManager.play('birthday');
          if (rect) {
            await animationManager.showMoneyEffect(1000, rect.left, rect.top);
            await animationManager.showParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'birthday');
          }
          this.showMessage('生日快乐！', `获得礼金 $1000！`, 'success');
          break;
          
        case 'tax':
          const taxAmount = Number(cell.effect?.match(/\d+/)?.[0]) || 500;
          player.money -= taxAmount;
          if (rect) {
            await animationManager.showMoneyEffect(-taxAmount, rect.left, rect.top);
          }
          // 播放税金音效
          soundManager.play('tax');
          this.showMessage('缴纳税金', `支付税金 $${taxAmount}`, 'warning');
          break;
          
        case 'property':
          if (cell.owner === undefined && player.money >= (cell.price || 0)) {
            // 如果没有主人且玩家有足够的钱，则可以购买
            await new Promise<void>((resolve) => {
              this.dialogContent = {
                title: '购买房产',
                message: `是否购买 ${cell.name}？价格：$${cell.price}`,
                type: 'info',
                action: () => {
                  this.buyProperty(cell, player);
                  this.closeDialog();
                  resolve();
                }
              };
              this.showDialog = true;
              
              // 添加取消按钮的回调
              const originalCloseDialog = this.closeDialog;
              this.closeDialog = () => {
                originalCloseDialog();
                resolve();
              };
            });
          } else if (cell.owner !== undefined && cell.owner !== player.id) {
            // 如果有主人且不是当前玩家，则需要支付租金
            // 计算租金（基础租金为房产价格的30%）
            const baseRent = Math.floor((cell.price || 0) * 0.3);
            
            // 获取房主拥有的地产数量
            const ownerPropertyCount = this.cells.filter(c => 
              c.type === 'property' && c.owner === cell.owner
            ).length;
            
            // 根据房主的地产数量增加租金（每个地产增加10%）
            const rentMultiplier = 1 + (ownerPropertyCount - 1) * 0.1;
            const finalRent = Math.floor(baseRent * rentMultiplier);

            // 显示租金计算提示
            this.showMessage(
              '支付租金',
              `需要支付租金 $${finalRent}\n` +
              `(基础租金：$${baseRent} × ${rentMultiplier.toFixed(1)}倍)`,
              'warning'
            );
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // 等待提示显示
            await this.payRent(player, cell.owner, finalRent);
          }
          break;
          
        case 'chance':
          if (rect) {
            await animationManager.showParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'chance');
          }
          this.drawChanceCard(player);
          break;
      }

      // 在处理完效果后检查游戏是否结束
      await this.checkGameOver();
    },

    buyProperty(cell: Cell, player: Player) {
      if (player.money >= (cell.price || 0)) {
        player.money -= (cell.price || 0);
        cell.owner = player.id;
        
        // 播放购买音效
        soundManager.play('buy');
        
        // 获取玩家棋子位置显示动画效果
        const element = document.querySelector(`[data-player-id="${player.id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 显示金钱动画效果
          animationManager.showMoneyEffect(-(cell.price || 0), rect.left, rect.top);
        }
        
        this.showMessage('购买成功', `你现在是 ${cell.name} 的主人了！`, 'success');
      }
    },

    async payRent(player: Player, ownerId: number, amount: number) {
      player.money -= amount;
      const owner = this.players.find(p => p.id === ownerId);
      if (owner) {
        owner.money += amount;
        
        // 获取玩家棋子位置
        const playerElement = document.querySelector(`[data-player-id="${player.id}"]`);
        if (playerElement) {
          const rect = playerElement.getBoundingClientRect();
          // 显示金钱动画效果
          await animationManager.showMoneyEffect(-amount, rect.left, rect.top);
        }

        // 获取房主棋子位置
        const ownerElement = document.querySelector(`[data-player-id="${ownerId}"]`);
        if (ownerElement) {
          const rect = ownerElement.getBoundingClientRect();
          // 显示金钱动画效果
          await animationManager.showMoneyEffect(amount, rect.left, rect.top);
        }

        // 播放金钱音效
        soundManager.play('money');
      }

      // 检查游戏是否结束
      await this.checkGameOver();
    },

    async drawChanceCard(player: Player) {
      const availableCards = this.settings.chanceCards.filter(card => !card.used);
      const totalProbability = availableCards.reduce((sum, card) => sum + (card.probability || 0), 0);
      
      // 先播放抽卡音效
      soundManager.play('chance');
      
      // 等待抽卡音效播放完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 随机数 0-100
      const random = Math.random() * 100;
      let accumulatedProbability = 0;
      let selectedCard = null;
      
      // 遍历所有可用卡片
      for (const card of availableCards) {
        accumulatedProbability += card.probability || 0;
        if (random <= accumulatedProbability) {
          selectedCard = card;
          break;
        }
      }
      
      // 如果没有抽中任何卡片，显示"无事发生"
      if (!selectedCard) {
        this.dialogContent = {
          title: '机会卡',
          message: '无事发生鸭~',
          type: 'info',
        };
        this.showDialog = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.closeDialog();
        return;
      }
      
      // 如果是一次性卡片，标记为已使用
      if (selectedCard.oneTime) {
        const originalCard = this.settings.chanceCards.find(
          card => card.effect === selectedCard.effect
        );
        if (originalCard) {
          originalCard.used = true;
        }
      }
      
      // 显示机会卡效果
      this.dialogContent = {
        title: '机会卡',
        message: selectedCard.effect + (selectedCard.amount ? `：${selectedCard.amount > 0 ? '+' : ''}$${selectedCard.amount}` : ''),
        type: selectedCard.type,
      };
      this.showDialog = true;

      // 等待一段时间后自动关闭对话框
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 执行效果
      if (selectedCard.amount) {
        player.money += selectedCard.amount;
      }
      
      // 获取玩家棋子位置
      const element = document.querySelector(`[data-player-id="${player.id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // 显示金钱动画效果和播放相应音效
        if (selectedCard.amount) {
          await animationManager.showMoneyEffect(selectedCard.amount, rect.left, rect.top);
          // 根据金额正负播放不同音效
          soundManager.play(selectedCard.amount > 0 ? 'money' : 'tax');
        }
        // 显示粒子效果
        await animationManager.showParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          'chance'
        );
      }
      
      // 关闭对话框
      this.closeDialog();
    },

    showMessage(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') {
      this.dialogContent = { title, message, type };
      this.showDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
      this.dialogContent = null;
    },

    nextPlayer() {
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    },

    // 获取格子的坐标位置
    getPositionCoordinates(position: number): { row: number; col: number } {
      const totalCells = this.cells.length;
      const sideLength = 9; // 每边格子数量
      
      if (position < sideLength) {
        // 顶部
        return { row: 0, col: position };
      } else if (position < sideLength + 7) {
        // 右侧
        return { row: position - sideLength + 1, col: sideLength - 1 };
      } else if (position < sideLength * 2 + 7) {
        // 底部
        return { row: 8, col: sideLength * 2 + 6 - position };
      } else {
        // 左侧
        return { row: totalCells - position, col: 0 };
      }
    },

    // 判断是否需要拐角路径
    needsCornerPath(current: { row: number; col: number }, next: { row: number; col: number }): boolean {
      return (current.row === 0 && next.col === 8) || // 顶部到右侧
             (current.col === 8 && next.row === 8) || // 右侧到底部
             (current.row === 8 && next.col === 0) || // 底部到左侧
             (current.col === 0 && next.row === 0);   // 左侧到顶部
    },

    // 获取拐角路径
    getCornerPath(current: { row: number; col: number }, next: { row: number; col: number }): number[] {
      const sideLength = 9;
      
      if (current.row === 0 && next.col === 8) {
        // 顶部到右侧的拐角
        return [sideLength - 1];
      } else if (current.col === 8 && next.row === 8) {
        // 右侧到底部的拐角
        return [sideLength + 7];
      } else if (current.row === 8 && next.col === 0) {
        // 底部到左侧的拐角
        return [sideLength * 2 + 6];
      } else if (current.col === 0 && next.row === 0) {
        // 左侧到顶部的拐角
        return [0];
      }
      
      return [];
    },

    async checkGameOver() {
      const bankruptPlayer = this.players.find(player => player.money <= 0);
      if (bankruptPlayer) {
        const winner = [...this.players].sort((a, b) => b.money - a.money)[0];
        this.winner = winner;
        this.isGameOver = true;

        // 停止背景音乐
        soundManager.pauseBGM();

        // 播放失败音效
        soundManager.play('lose');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 播放胜利音效
        soundManager.play('win');

        // ���放结束动画
        await this.playGameOverAnimation(winner, bankruptPlayer);

        // 显示结束对话框
        this.showGameOverDialog(winner, bankruptPlayer);
      }
    },

    async playGameOverAnimation(winner: Player, loser: Player) {
      // 获取所有玩家的棋子元素
      const playerTokens = this.players.map(player => 
        document.querySelector(`[data-player-id="${player.id}"]`)
      );

      // 获胜者动画
      const winnerToken = playerTokens[winner.id];
      if (winnerToken) {
        // 放大并添加光环效果
        winnerToken.animate([
          { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
          { transform: 'scale(1.5) rotate(360deg)', filter: 'brightness(1.5)' }
        ], {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards'
        });

        // 添加粒子效果
        const rect = winnerToken.getBoundingClientRect();
        await animationManager.showParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          'birthday'
        );
      }

      // 失败者动画
      const loserToken = playerTokens[loser.id];
      if (loserToken) {
        loserToken.animate([
          { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          { transform: 'scale(0) rotate(-180deg)', opacity: 0 }
        ], {
          duration: 800,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards'
        });
      }

      // 其他玩家动画
      playerTokens.forEach((token, index) => {
        if (index !== winner.id && index !== loser.id && token) {
          token.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0.8)', opacity: 0.6 }
          ], {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          });
        }
      });

      // 等待动画完成
      await new Promise(resolve => setTimeout(resolve, 1500));
    },

    showGameOverDialog(winner: Player, loser: Player) {
      this.dialogContent = {
        title: '游戏结束！',
        message: `${loser.name} 破产了！\n${winner.name} 以 $${winner.money.toLocaleString()} 的资产获得胜利！`,
        type: 'success',
        action: () => {
          // 重置游戏
          this.isGameStarted = false;
          this.isGameOver = false;
          this.winner = null;
          this.players = [];
          this.currentPlayer = 0;
          this.cells.forEach(cell => {
            if (cell.type === 'property') {
              delete cell.owner;
            }
          });
        },
        // 添加样式配置
        props: {
          style: {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
          }
        }
      };
      this.showDialog = true;
    },

    updateSettings(newSettings: GameSettings) {
      this.settings = { ...newSettings };
      
      // 保存设置到 localStorage
      localStorage.setItem('gameSettings', JSON.stringify(newSettings));
      
      // 根据新设置重新生成格子
      this.cells = this.generateCells(newSettings);
      
      // 如果游戏已经开始，使用新的初始资金重置家
      if (this.isGameStarted) {
        this.players.forEach(player => {
          player.money = newSettings.initialMoney;
        });
      }
    },

    generateCells(settings: GameSettings): Cell[] {
      const cells: Cell[] = [];
      let id = 0;

      // 地产名称池
      const propertyNames = [
        '东大街', '西大街', '南大街', '北大街',
        '和平路', '青年路', '解放路', '中山路',
        '人民路', '文化街', '科技路', '商业街',
        '金融街', '未来路', '创新路', '成功路',
        '幸福路', '希望街', '阳光路', '彩虹街',
        '星光路', '月亮街', '银河路', '梦想街',
        '自由路', '欢乐街', '友谊路', '和谐街',
        '繁华路', '富贵街', '吉祥路', '如意街'
      ];

      // 随机打乱地产名称池
      const shuffledNames = [...propertyNames].sort(() => Math.random() - 0.5);
      let nameIndex = 0;

      // 添加起点
      cells.push({
        id: id++,
        type: 'start',
        name: '起点',
        effect: `经过或停留获得${settings.startBonus}`
      });

      // 计算每种类型格子的间隔
      const totalCells = 32; // 总格子数
      const remainingCells = totalCells - settings.cellCounts.start;
      const propertyInterval = Math.floor(remainingCells / settings.cellCounts.property);
      const chanceInterval = Math.floor(remainingCells / settings.cellCounts.chance);
      const birthdayInterval = Math.floor(remainingCells / settings.cellCounts.birthday);
      const taxInterval = Math.floor(remainingCells / settings.cellCounts.tax);

      // 生成其他格子
      for (let i = 1; i < totalCells; i++) {
        let cell: Cell;

        if (i % propertyInterval === 0 && cells.filter(c => c.type === 'property').length < settings.cellCounts.property) {
          // 添加地产格子
          const price = Math.floor(
            settings.propertyMinPrice +
            (settings.propertyMaxPrice - settings.propertyMinPrice) *
            (cells.filter(c => c.type === 'property').length / settings.cellCounts.property)
          );
          cell = {
            id: id++,
            type: 'property',
            name: shuffledNames[nameIndex++], // 使用随机名称
            price
          };
        } else if (i % chanceInterval === 0 && cells.filter(c => c.type === 'chance').length < settings.cellCounts.chance) {
          // 添加机会格子
          cell = {
            id: id++,
            type: 'chance',
            name: '机会',
            effect: '抽取机会卡片'
          };
        } else if (i % birthdayInterval === 0 && cells.filter(c => c.type === 'birthday').length < settings.cellCounts.birthday) {
          // 添加生日格子
          cell = {
            id: id++,
            type: 'birthday',
            name: '生日惊喜',
            effect: `获得礼金${settings.birthdayBonus}`
          };
        } else if (i % taxInterval === 0 && cells.filter(c => c.type === 'tax').length < settings.cellCounts.tax) {
          // 添加税收格子
          cell = {
            id: id++,
            type: 'tax',
            name: '税收',
            effect: `支付税金${settings.taxAmount}`
          };
        } else {
          // 添加默认地产格子
          const price = Math.floor(
            settings.propertyMinPrice +
            (settings.propertyMaxPrice - settings.propertyMinPrice) *
            (cells.filter(c => c.type === 'property').length / settings.cellCounts.property)
          );
          cell = {
            id: id++,
            type: 'property',
            name: shuffledNames[nameIndex++], // 使用随机名称
            price
          };
        }

        cells.push(cell);
      }

      return cells;
    }
  },

  getters: {
    currentPlayerData: (state) => state.players[state.currentPlayer],
    isCurrentPlayersTurn: (state) => {
      if (!state.isGameStarted) return false;
      if (state.isGameOver) return false;
      if (state.isMoving) return false;
      return true;
    },
  },
});