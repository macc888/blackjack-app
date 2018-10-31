import { Injectable } from '@angular/core';
import { Deck, Card, Suit } from '../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor() { }

  public shuffleDeck(): Deck {
    const deck = this.buildDeck();
    for (let i = deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
    }
    return deck;
  }

  public buildDeck(): Deck {
    const deck: Deck = new Deck();
    const cards: Card[] = [];
    for (let i = 0; i < 52; i++) {
      const card: Card = new Card();
      const suitDivider: number = Math.floor(i / 13);
      const suit: Suit = this.getSuite(suitDivider);
      const cardNumber: number = i % 13 + 1;
      card.suit = suit;
      card.val = this.mapCardValue(cardNumber);
      card.display = this.mapDisplay(cardNumber);
      cards.push(card);
    }
    deck.cards = cards;
    return deck;
  }

  private getSuite(suiteNumber: number): Suit {
    let suit: Suit;
    switch (suiteNumber) {
      case 0:
        suit = Suit.Club;
        break;
      case 1:
        suit = Suit.Diamond;
        break;
      case 2:
        suit = Suit.Heart;
        break;
      case 3:
        suit = Suit.Spade;
        break;
      default:
        console.log('Things have gone wrong');
    }
    return suit;
  }

  private mapDisplay(val: number): string {
    let display: string;
    switch (val) {
      case 1:
        display = 'A';
        break;
      case 11:
        display = 'J';
        break;
      case 12:
        display = 'Q';
        break;
      case 13:
        display = 'K';
        break;
      default:
        display = val + '';
    }
    return display;
  }

  private mapCardValue(val: number): number {
    if (val >= 10) {
      return 10;
    }
    return val;
  }
}
