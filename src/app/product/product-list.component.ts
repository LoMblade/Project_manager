import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ExcelExportService } from '../services/excel-export.service';
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

  constructor(
    private productService: ProductService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 0) {
    const pageRequest: PageRequest = {
      page: page,
      size: this.pageSize
    };

    this.productService.getAllPaginated(pageRequest).subscribe(data => {
      console.log('Loaded products from API:', data.content);
      console.log('First few product IDs:', data.content.slice(0, 3).map(p => ({ id: p.id, name: p.name })));
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

  goToFirstPage() {
    if (!this.isFirst) {
      this.loadProducts(0);
    }
  }

  goToLastPage() {
    if (!this.isLast) {
      this.loadProducts(this.totalPages - 1);
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
    console.log('All products in list:', this.products.map(p => ({ id: p.id, name: p.name })));
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

  // Excel Export methods
  exportAllToExcel() {
    console.log('Export all products called');
    if (this.allProducts.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    try {
      console.log('Exporting', this.allProducts.length, 'products');
      this.excelExportService.exportProductsToExcel(
        this.allProducts,
        'tat-ca-san-pham'
      );
      console.log('✅ Excel export completed successfully');
      alert('Đã xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export all Excel error:', error);
      alert(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }

  exportFilteredToExcel() {
    console.log('Export filtered products called');
    if (this.products.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    try {
      console.log('Exporting', this.products.length, 'filtered products');
      console.log('Filters:', { category: this.selectedCategory, searchTerm: this.searchTerm });
      this.excelExportService.exportProductsToExcel(
        this.products,
        'san-pham-da-loc'
      );
      console.log('✅ Excel export completed successfully');
      alert('Đã xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export filtered Excel error:', error);
      alert(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }

  exportCurrentPageToExcel() {
    console.log('Export current page called');
    if (this.products.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    try {
      console.log('Exporting current page with', this.products.length, 'products');
      console.log('Current page:', this.currentPage + 1);
      this.excelExportService.exportProductsToExcel(
        this.products,
        `san-pham-trang-${this.currentPage + 1}`
      );
      console.log('✅ Excel export completed successfully');
      alert('Đã xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export current page Excel error:', error);
      alert(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }
}