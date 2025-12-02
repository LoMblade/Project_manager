import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { PageRequest } from '../models/pagination.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]   // BẮT BUỘC PHẢI CÓ DÒNG NÀY
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  isFirst: boolean = true;
  isLast: boolean = true;
  hoveredProduct: Product | null = null;

  // Filter & Search
  selectedCategory: string = '';
  searchTerm: string = '';
  allProducts: Product[] = []; // Store original data

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 0) {
    const pageRequest: PageRequest = {
      page: page,
      size: this.pageSize
    };

    this.productService.getAllPaginated(pageRequest).subscribe(data => {
      this.allProducts = data.content; // Store original data
      this.applyFilters(); // Apply current filters
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.isFirst = data.first;
      this.isLast = data.last;
    });
  }

  delete(id: number) {
    if (confirm('Bạn có chắc muốn xóa hàng hóa này?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          alert('Xóa thành công!');
          // Reload current page after deletion
          this.loadProducts(this.currentPage);
        },
        error: () => alert('Xóa thất bại!')
      });
    }
  }

  // Pagination methods
  nextPage() {
    if (!this.isLast) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  previousPage() {
    if (!this.isFirst) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadProducts(page);
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getEndIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  // Filter & Search methods
  onCategoryChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allProducts];

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filter by search term (name, code, description)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    this.products = filtered;
  }

  // Edit method
  onEditClick(product: Product) {
    console.log('Edit clicked for product:', product);
    console.log('Product ID:', product.id, 'Type:', typeof product.id);
  }

  // Image hover methods
  showImage(product: Product) {
    this.hoveredProduct = product;
    console.log('Hovering product:', product.name, 'ID:', product.id, 'Image:', product.image);
  }

  hideImage() {
    console.log('Hide image - hoveredProduct:', this.hoveredProduct);
    this.hoveredProduct = null;
  }
}