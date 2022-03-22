import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CardViewComponent } from '../../card-view/card-view.component';

@Component({
  selector: 'app-ipltheme',
  templateUrl: './ipltheme.component.html',
  styleUrls: ['./ipltheme.component.css'],
})
export class IplthemeComponent implements OnInit {
  actionStatus: boolean = false;
  mode: string = 'preview';
  selectedTeam: string = '';

  @ViewChild(CardViewComponent, { static: true })
  child!: CardViewComponent;

  constructor() {}

  ngOnInit(): void {}

  setCardBg(team: string) {
    this.selectedTeam = team;
  }

  updateCard() {
    this.child.updateCard(this.selectedTeam);
  }
}
