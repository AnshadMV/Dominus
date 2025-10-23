import { Component, HostListener, inject, OnInit } from '@angular/core';
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
  private router = inject(Router)
  productCount: number = website_constants.HomePage.FeatureProductCount;
  products: Product[] = [];
  services: VideoServices[] = [];
  showSkeleton = true;
  ngOnInit() {
    this.loadVideoServices(); if (this.screenWidth >= 768) this.isMenuOpen = true;
    this.loadProducts();
    // Add page transition class
    document.body.classList.add('page-transition');
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
    this.initIntersectionObserver();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadProducts() {
    this.productService.getTopProducts(this.productCount).subscribe({
      next: (products) => {
        this.products = products;
        setTimeout(() => {
          this.showSkeleton = false;
          this.animateProductCards();
        }, 500);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.showSkeleton = false;

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
        setTimeout(() => this.animateServiceCards(), 300);

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

  }
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 768) {
      this.isMenuOpen = true;
    } else {
      this.isMenuOpen = false;
    }
  }

  // Scroll animations
  initScrollAnimations() {
    window.addEventListener('scroll', this.throttle(this.handleScroll, 100));
  }

  throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function (this: any) {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  handleScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Intersection Observer for more precise animations
  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Observe all animatable elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item')
      .forEach(el => observer.observe(el));
  }

  // Animate product cards with stagger effect
  animateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      card.classList.add('stagger-item');
    });
  }

  // Animate service cards
  animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.15}s`;
      card.classList.add('slide-in-right');
    });
  }

  // Navigation animation
  navigateWithAnimation(route: string) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-out';

    setTimeout(() => {
      this.router.navigate([route]);
      document.body.style.opacity = '1';
    }, 300);
  }

  // Shimmer effect for loading states
  getSkeletonArray(count: number): any[] {
    return Array(count).fill(0);
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    document.body.classList.remove('page-transition');
  }

}
