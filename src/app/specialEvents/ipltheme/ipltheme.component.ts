import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CardViewComponent } from '../../card-view/card-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ipltheme',
  templateUrl: './ipltheme.component.html',
  styleUrls: ['./ipltheme.component.css'],
})
export class IplthemeComponent implements OnInit {
  actionStatus: boolean = false;
  mode: string = 'preview';
  selectedTeam: any;
  cardData: any;
  cardId: any;

  @ViewChild(CardViewComponent, { static: true })
  child!: CardViewComponent;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedTeam = params['selectedTeam'];
    });
  }

  setCardBg(team: string) {
    this.selectedTeam = team;
    this.child.removeInlineStyles(this.selectedTeam);
  }

  updateCard() {
    this.child.updateCard(this.selectedTeam);
  }
}
