import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-property-modal',
  standalone:false,
  templateUrl: './property-modal.component.html',
  styleUrls: ['./property-modal.component.scss'],
})
export class PropertyModalComponent implements OnInit {
  // Property to track the currently hovered image
  currentLargeImage: string | null = null;
  constructor(private modalController: ModalController) {}



  // Function to update the image when hovering
  showLargeImage(imageId: string): void {
    console.log('Hovered over image:', imageId);
    this.currentLargeImage = imageId;
  }

  ngOnInit() {}
  

  dismiss() {
    this.modalController.dismiss();
  }

}
