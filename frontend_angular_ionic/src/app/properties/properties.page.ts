import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PropertyType } from '../shared/enums/property';
import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { User } from '../shared/interface/user';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit, OnDestroy {
  // ViewChild to interact with child components
  @ViewChild('propertyLists') propertyListsComponent: PropertiesListComponent;

  // Public variables for data binding and state management
  public progressBar = false; // Controls progress bar visibility
  public search = ''; // Stores the search query
  public properties: Property[] = []; // Stores the list of properties
  public ownedPropertiesOnly = signal(false); // Manages the toggle state for owned properties
  public filterBy: PropertyType[] = []; // Stores selected filter types
  public user$: Observable<any>; // Observable for user session
  public userSub = new BehaviorSubject<any>(''); // BehaviorSubject for user state
  public isUser: boolean; // Flag to check if user is logged in
  public user: User; // Stores the logged-in user's information
  data: any; // General data holder

  // Subject for handling unsubscription to prevent memory leaks
  private unSubscribe$ = new Subject<void>();

  constructor(
    public modalController: ModalController, // Controller for managing modals
    private userService: UserService, // User service for session and authentication
    private router: Router, // Router for navigation
    private toastCtrl: ToastController, // Toast controller for notifications
    private alertController: AlertController, // Alert controller for confirmation dialogs
    private toastController: ToastController // Toast controller (duplicated, consider removing if not needed)
  ) {}

  async ngOnInit() {
    // Initialize the component
    console.log('oninit');

    // Subscribe to user session updates
    this.userService.userSessionSub.subscribe(({ isSession }) => {
      console.log('prop session', isSession);
      this.isUser = isSession; // Set user session status
    });
  }

  ngOnDestroy(): void {
    // Cleanup to prevent memory leaks when the component is destroyed
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  async presentModal() {
    // Open a modal for adding new properties
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent,
    });
    await modalPropertiesNew.present();

    // Handle the modal dismissal event
    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data); // Open the upload modal with the returned property data
    }
  }

  public switchOwnedProperty(event: CustomEvent) {
    // Toggle the view to show only owned properties
    this.ownedPropertiesOnly.set(event.detail.checked);
  }

  private async presentUploadModal(property: Property) {
    // Open a modal for uploading property details
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property }, // Pass the property as a prop
    });
    await modalUploads.present();
  }

  public async signOut() {
    // Display a confirmation dialog for signing out
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class', // Custom class for styling
      header: 'Are you sure?', // Dialog title
      message: 'You will be Signed out!!!', // Dialog message
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel', // Role for cancel button
          cssClass: 'secondary', // Secondary button style
        },
        {
          text: 'Sign out',
          cssClass: 'danger', // Danger button style
          handler: async () => {
            // Perform sign-out action
            this.data = await this.userService.signOut();
            this.isUser = this.data.session; // Update user session status
            this.showToast(); // Show success message
            this.router.navigate(['/properties']); // Navigate to properties page
          },
        },
      ],
    });
    await alert.present(); // Present the alert dialog
  }

  private async showToast() {
    // Show a success toast notification
    const toast = await this.toastController.create({
      message: 'Success, you have signed out.', // Notification message
      color: 'success', // Success color
      duration: 3000, // Display duration
    });
    toast.present();
  }
}
