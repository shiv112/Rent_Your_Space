import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { PropertyModalComponent } from '../property-modal/property-modal.component';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit, OnDestroy {
  public properties: Property[];
  propertData: any;

  constructor(
    private propertiesService: PropertiesService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    this.getProperties();
  }

  ngOnDestroy() {}

  async openPropertyModal() {
    const modal = await this.modalController.create({
      component: PropertyModalComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  private async getProperties() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    this.propertiesService.fetchProperties().then((result) => {
      // loader end
      loading.dismiss();
      this.properties = result.data;
      console.log(this.properties);
    });
  }

  // show loader on api calls
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }
}
