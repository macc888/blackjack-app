import { Injectable } from '@angular/core';
import { Hand, Outcome, LeaderBoardEntry } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly LEADER_BOARD_KEY: string = 'LEADER_BOARD_KEY';

  constructor() { }

  public computeBetResult(dealersHand: Hand, playersHands: Hand[]): number {
    let betResult = 0;
    for (const hand of playersHands) {
      let handBet: number = hand.bet;
      if (dealersHand.outcome === Outcome.BlackJack) {
        if (hand.outcome !== Outcome.BlackJack) {
          handBet = 0;
        }
      } else if (dealersHand.outcome === Outcome.Bust) {
        handBet = handBet * 2;
      } else {
        if (hand.outcome === Outcome.BlackJack) {
          handBet  = Math.floor(2.5 * handBet);
        } else if (hand.val > dealersHand.val && hand.outcome !== Outcome.Bust) {
          handBet = handBet * 2 ;
        } else if (hand.val < dealersHand.val || hand.outcome === Outcome.Bust) {
          handBet = 0;
        }
      }
      betResult += handBet * 1;
    }
    return betResult;
  }

  public scoreHand(hand: Hand) {
    this.setHandValue(hand);
    this.setHandOutcome(hand);
  }

  private setHandValue(hand: Hand) {
    if (hand) {
      let total = 0;
      if (!!hand && hand.cards && hand.cards.length >= 2) {
        let aceCount = 0;
        for (const card of hand.cards) {
          total += card.val;
          if (card.val === 1) {
            aceCount += 1;
            total += 10;
          }
        }
        if (total > 21 && aceCount > 0) {
          total = total - (10 * (aceCount - 1));
          if (total > 21) {
            total = total - 10;
          }
        }
      }
      hand.val = total;
    }
  }

  private setHandOutcome(hand: Hand) {
    if (hand) {
      if (hand.val === 21) {
        if (hand.cards.length === 2 && (hand.cards[0].val === 1 || hand.cards[1].val === 1)) {
          hand.outcome = Outcome.BlackJack;
        } else {
          hand.outcome = Outcome.TwentyOne;
        }
      }

      if (hand.val > 0 && hand.val < 21) {
        if (hand.cards.length === 2 && (hand.cards[0].display === hand.cards[1].display)) {
          hand.outcome = Outcome.CanSplit;
        } else {
          hand.outcome = Outcome.CanHit;
        }
      }

      if (hand.val > 21) {
        hand.outcome = Outcome.Bust;
      }
    }
    return;
  }

  public saveLeaderBoardEntry(leaderBoardEntry: LeaderBoardEntry) {
    console.log('leader board entry:', leaderBoardEntry);
    const leaderList: LeaderBoardEntry[] = this.getLeaderBoard();
    leaderList.push(leaderBoardEntry);
    leaderList.sort((a: LeaderBoardEntry, b: LeaderBoardEntry) => {
      return a.score - b.score;
    });
    localStorage.setItem(this.LEADER_BOARD_KEY, JSON.stringify(leaderList));
  }

  public getLeaderBoard(): LeaderBoardEntry[] {
    const leaderListStr = localStorage.getItem(this.LEADER_BOARD_KEY);
    console.log('leader board:', leaderListStr);
    const leaderList: LeaderBoardEntry[] =  JSON.parse(leaderListStr ? leaderListStr : '[]');
    leaderList.sort((a: LeaderBoardEntry, b: LeaderBoardEntry) => {
      return b.score - a.score;
    });
    return leaderList;
  }
}
