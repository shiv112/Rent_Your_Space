import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesService } from '../enquiries.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sortListByDate, sortListByName } from 'src/app/shared/utility';

@Component({
  selector: 'app-enquiries-list',
  standalone:false,
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnDestroy {

  @Output() isLoading = new EventEmitter<boolean>();
  public date = new Date();
  public enquiries: Enquiry[] = [];
  public filterBy: string[] = [];
  public sortBy = 'latest';
  public searchText = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private enquiriesService: EnquiriesService,
    private router: Router,
  ) { }


  ngOnDestroy() {
    this.unSubscribed();
  }

  public onParentDidEnter() {
    this.getEnquiries();
  }

  public selectEnquiry(enquiry: Enquiry) {
    this.router.navigate(['/enquiries', enquiry.enquiry_id]);
  }

  public setFilters(filter: string[]) {
    this.filterBy = filter;
    this.getEnquiries();
  }

  public setSort(sort: string) {
    this.sortBy = sort;
    this.getEnquiries();
  }

  public setSearch(text: string) {
    text = text.trim().toLowerCase();
    if (this.searchText !== text) {
      this.searchText = text;
      this.getEnquiries();
    }
  }

  private sortEnquiries() {
    switch (this.sortBy) {
      case 'title':
        this.enquiries = sortListByName(this.enquiries, { property: 'title' });
        break;
      case 'oldest':
        this.enquiries = sortListByDate(this.enquiries, { latest: false, property: 'createdAt' });
        break;
      default:
        this.enquiries = sortListByDate(this.enquiries, { property: 'createdAt' });
        break;
    }
  }

  private searchEnquiries() {
    return this.enquiries.filter((item: Enquiry) => {
      const title = item.title.toLowerCase();
      const email = item.email.toLowerCase();
      return title.includes(this.searchText) || email.includes(this.searchText);
    });
  }

  private async getEnquiries() {
    this.unSubscribed();
    this.isLoading.emit(true);
    this.enquiriesService.enquiries$.pipe(takeUntil(this.unsubscribe$)).subscribe((enquiries) => {
      this.enquiries = enquiries;
      this.sortEnquiries();

      if (this.searchText) {
        this.enquiries = this.searchEnquiries();
      }
      if (this.filterBy.length) {
        this.enquiries = this.enquiries.filter(item => this.filterBy.includes(item.topic));
      }
      if (this.enquiriesService.initialFetchDone) {
        this.isLoading.emit(false);
      }
    });
  }

  private unSubscribed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
