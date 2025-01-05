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

/**
 * PropertiesListComponent is responsible for displaying a list of properties
 * and providing functionality to open a modal to view property details.
 */
@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit, OnDestroy {
  // List to hold the fetched property data
  public properties: Property[];

  // Service for fetching property data
  private propertData: any;

  /**
   * Constructor to inject necessary services
   * @param propertiesService - Service to handle property data
   * @param loadingController - Controller to manage loading spinner
   * @param modalController - Controller to manage modals
   */
  constructor(
    private propertiesService: PropertiesService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {}

  /**
   * ngOnInit lifecycle hook to fetch properties when the component initializes
   */
  async ngOnInit() {
    this.getProperties(); // Fetch properties when component is initialized
  }

  /**
   * ngOnDestroy lifecycle hook. It will be called when the component is destroyed.
   * Currently, it doesn't handle any logic but can be extended if needed.
   */
  ngOnDestroy() {}

  /**
   * Opens the property detail modal
   * @returns A promise that resolves when the modal is opened
   */
  async openPropertyModal() {
    const modal = await this.modalController.create({
      component: PropertyModalComponent, // Property modal component
      cssClass: 'prop-detail-css', // Custom CSS class for styling
    });
    return await modal.present(); // Show the modal to the user
  }

  /**
   * Fetches the list of properties from the PropertiesService
   * Displays a loading spinner while fetching data
   */
  private async getProperties() {
    // Start loading animation before API call
    const loading = await this.presentLoading();
    loading.present();

    // Fetch properties from service
    this.propertiesService.fetchProperties().then((result) => {
      // End loading animation after data is fetched
      loading.dismiss();

      // Set the fetched properties to the component's properties array
      this.properties = result.data;
      console.log(this.properties); // Log the fetched properties for debugging
    });
  }

  /**
   * Creates and returns a loading spinner to be displayed while waiting for API responses
   * @returns A loading controller instance to control the spinner's display
   */
  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class', // Custom CSS for loading spinner
      message: 'Please wait...', // Loading message to display
    });
  }
}
