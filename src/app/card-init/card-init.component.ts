import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-card-init',
  templateUrl: './card-init.component.html',
  styleUrls: ['./card-init.component.css']
})
export class CardInitComponent implements OnInit {
  selectedCard: string = "";

  constructor(public route: Router) { }

  personalFormInit() {
    this.route.navigate(["/card/edit/"], { queryParams: { cardType: "personal", status: "new" } })
  }

  businessFormInit() {
    this.route.navigate(["/card/edit/"], { queryParams: { cardType: "business", status: "new" } })
  }


  ngOnInit(): void {
  }

}
