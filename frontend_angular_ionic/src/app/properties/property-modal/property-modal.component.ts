import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-property-modal',
  templateUrl: './property-modal.component.html',
  styleUrls: ['./property-modal.component.scss'],
})
export class PropertyModalComponent implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  

  dismiss() {
    this.modalController.dismiss();
  }

}
