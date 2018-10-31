export class Card {
  public val: number;
  public suit: Suit;
  public faceDown = false;
  public display: string;
}

export class Deck {
  public cards: Card[] = [];
}

export class Hand {
  public bet: number;
  public val: number;
  public outcome: Outcome;
  public cards: Card[] = [];
}

export class User {
  public name: string;
  public score: number;
  public hand: Hand[] = [];
}

export class LeaderBoardEntry {
  public name: string;
  public score: number;
}

export enum Outcome {
  Bust = 'Bust',
  TwentyOne = 'Twenty One',
  BlackJack = 'Blackjack!',
  Stand = 'Stand',
  CanSplit = 'CanSplit',
  CanHit = 'CanHit'
}

export enum Suit {
  Heart = 'H',
  Diamond = 'D',
  Spade = 'S',
  Club = 'C'
}

export enum GameState {
  INITIAL = 'INITIAL',
  BETTING_ROUND = 'BETTING_ROUND',
  PLAYERS_TURN = 'PLAYERS_TURN',
  DEALERS_TURN = 'DEALERS_TURN',
  ROUND_END = 'ROUND_END'
}

export enum GameEvent {
  START_GAME = 'START_GAME',
  PLACE_BET = 'PLACE_BET',
  PLAYERS_TURN_END = 'PLAYERS_TURN_END',
  DEALERS_TURN_END = 'DEALERS_TURN_END',
}
