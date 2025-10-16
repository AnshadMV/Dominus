import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { website_constants } from 'src/app/core/constants/app.constant';
import { VideoServices } from 'src/app/core/models/homevideoservice.model';
import { Product } from 'src/app/core/models/product.model';
import { HomeVideoService } from 'src/app/core/services/homevideo.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videoError = false;
  isLoading = true;
  isMenuOpen = false;
  screenWidth = window.innerWidth;
  private productService = inject(ProductService);
  private HomeVideoService = inject(HomeVideoService);
  productCount: number = website_constants.HomePage.FeatureProductCount;
  products: Product[] = [];
  services: VideoServices[] = [];

  ngOnInit() {
    this.loadProducts();
    this.loadVideoServices(); if (this.screenWidth >= 768) this.isMenuOpen = true;
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadProducts() {
    this.productService.getTopProducts(this.productCount).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  // scrollCarousel(direction: 'left' | 'right') {
  //   const container = document.getElementById('carousel');
  //   if (!container) return;
  //   const scrollAmount = 340;
  //   container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  // }
  loadVideoServices() {
    this.HomeVideoService.getFeaturedVideoServices(4).subscribe({
      next: (VideoServices) => {
        console.log('Services loaded:', VideoServices);

        this.services = VideoServices;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }


  onVideoLoaded() {
    this.isLoading = false;

    const video = document.querySelector('video');
    if (video) {
      video.muted = true;    // inline muted work aakunnilla. So i created this
      video.classList.remove('opacity-0');
      video.classList.add('opacity-100');
    }

  } onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 768) {
      this.isMenuOpen = true;
    } else {
      this.isMenuOpen = false;
    }
  }
}
