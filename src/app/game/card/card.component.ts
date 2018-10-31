import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/shared/models/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input()
  public card: Card;

  constructor() { }

  ngOnInit() {
  }

  public getCardString(card: Card): string {
    if (card) {
      if (!card.faceDown) {
        return card.display + card.suit;
      } else {
        return 'red_back';
      }
    }
  }

  public getCardImgSrc(card: Card): string {
    return 'assets/cards/' + this.getCardString(card) + '.png';
  }
}
