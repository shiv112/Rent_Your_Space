import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';


@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit, OnDestroy {
  public properties: Property[];
  propertData:any;

  constructor(
    private propertiesService: PropertiesService,
  ) { }

  ngOnInit() {
    this.getProperties();
  }

  ngOnDestroy() {
  }

  private getProperties() {
    this.propertiesService.fetchProperties().then((result)=>{
      this.properties = result.data;
      console.log(this.properties);
    });
    
  }

}
