export interface Player {
    id: number;
    name: string;
    position: number;
    money: number;
    color: string;
    properties?: number[];
  }
  
  export interface Cell {
    id: number;
    type: CellType;
    name: string;
    price?: number;
    owner?: number;
    effect?: string;
    level?: number;
  }
  
  export type CellType = 'start' | 'property' | 'chance' | 'birthday' | 'tax';
  
  export interface DialogContent {
    title: string;
    message: string;
    type: DialogType;
    action?: () => void;
    component?: string;
    props?: Record<string, any>;
  }
  
  export type DialogType = 'info' | 'success' | 'warning' | 'error';
  
  export interface ChanceCard {
    effect: string;
    amount: number;
    type: DialogType;
    probability: number;
    oneTime?: boolean;
    used?: boolean;
  }
  
  export interface GameConfig {
    initialMoney: number;
    startBonus: number;
    maxLevel: number;
    rentRates: number[];
  }
  
  export interface GameState {
    isPlaying: boolean;
    currentPlayerIndex: number;
    diceNumber: number;
    lastRollTime?: number;
  }
  
  export type GameEvent = {
    type: 'move' | 'buy' | 'pay' | 'receive' | 'chance' | 'birthday' | 'tax';
    playerId: number;
    amount?: number;
    targetId?: number;
    cellId?: number;
    message?: string;
  };
  
  export interface GameHistory {
    timestamp: number;
    event: GameEvent;
  }
  
  export interface GameStats {
    totalMoves: number;
    totalMoney: number;
    propertyCount: number;
    chanceCount: number;
    birthdayCount: number;
    taxCount: number;
  }
  
  export interface PlayerStats extends GameStats {
    playerId: number;
    winCount: number;
    loseCount: number;
    bestScore: number;
  }
  
  export interface GameStore {
    players: Player[];
    currentPlayer: number;
    cells: Cell[];
    isGameStarted: boolean;
    showDialog: boolean;
    dialogContent: {
      title: string;
      message: string;
      type: DialogType;
      action?: () => void;
      component?: string;
      props?: Record<string, any>;
    } | null;
    isGameOver: boolean;
    winner: Player | null;
    settings: GameSettings;
    isMoving: boolean;
  }
  
  export interface GameSettings {
    initialMoney: number;
    startBonus: number;
    cellCounts: {
      start: number;
      property: number;
      chance: number;
      birthday: number;
      tax: number;
    };
    propertyMinPrice: number;
    propertyMaxPrice: number;
    taxAmount: number;
    birthdayBonus: number;
    chanceCards: ChanceCard[];
    playerNames: string[];
  }