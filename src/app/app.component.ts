
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  isConnected = true;
  title = 'Internet-card-project';


  constructor(private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
  }
}



