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
import { LoadingController } from '@ionic/angular';

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
    public loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // loader start
    const loading = await this.presentLoading();
    loading.present();
    this.getProperties();
    // loader end
    await loading.dismiss();
  }

  ngOnDestroy() {}

  private getProperties() {
    this.propertiesService.fetchProperties().then((result) => {
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
