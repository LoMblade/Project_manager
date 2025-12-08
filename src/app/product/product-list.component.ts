import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ExcelExportService } from '../services/excel-export.service';
import { NotificationService } from '../services/notification.service';
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
  allProducts: Product[] = []; // Tất cả sản phẩm từ API
  filteredProducts: Product[] = []; // Sản phẩm sau khi lọc

  constructor(
    private productService: ProductService,
    private excelExportService: ExcelExportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Restore pagination state if available
    const savedPage = sessionStorage.getItem('productListPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage, 10);
      sessionStorage.removeItem('productListPage');
    }
    
    this.loadAllProducts();
  }

  // Load tất cả sản phẩm từ API
  loadAllProducts() {
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Loaded all products from API:', data.length);
        this.allProducts = data;
        
        // Handle updated or newly created product
        const updatedProduct = sessionStorage.getItem('updatedProduct');
        if (updatedProduct) {
          const product = JSON.parse(updatedProduct);
          
          // Check if it's an update (product already exists) or new creation
          const existingIndex = this.allProducts.findIndex(p => p.id === product.id);
          if (existingIndex > -1) {
            // Update existing product
            this.allProducts[existingIndex] = product;
            console.log('✅ Product updated:', product);
          } else {
            // Add new product at the beginning
            this.allProducts.unshift(product);
            console.log('✅ Product added:', product);
          }
          
          sessionStorage.removeItem('updatedProduct');
        }
        
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.notificationService.error('Không thể tải danh sách sản phẩm!');
      }
    });
  }

  // Save current pagination state before navigating
  savePaginationState() {
    sessionStorage.setItem('productListPage', this.currentPage.toString());
  }

  delete(id: number) {
    if (confirm('Đã chắc chưa ???')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Xóa sản phẩm thành công!');
          // Remove the product from local array without reloading
          this.allProducts = this.allProducts.filter(p => p.id !== id);
          
          // Recalculate pagination after deletion
          this.applyFilters();
          
          // If current page is now empty (last page had 1 item), go to previous page
          if (this.products.length === 0 && this.currentPage > 0) {
            this.currentPage--;
            this.applyFilters();
          }
        },
        error: () => this.notificationService.error('Xóa sản phẩm thất bại!')
      });
    }
  }

  // Pagination methods
  nextPage() {
    if (!this.isLast) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  previousPage() {
    if (!this.isFirst) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  goToFirstPage() {
    if (!this.isFirst) {
      this.currentPage = 0;
      this.applyFilters();
    }
  }

  goToLastPage() {
    if (!this.isLast) {
      this.currentPage = this.totalPages - 1;
      this.applyFilters();
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

  // Filter & Search methods
  onCategoryChange() {
    this.currentPage = 0; // Reset to first page
    this.applyFilters();
  }

  onSearchChange() {
    this.currentPage = 0; // Reset to first page
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 0;
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

    this.filteredProducts = filtered;
    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    
    // Calculate pagination
    this.isFirst = this.currentPage === 0;
    this.isLast = this.currentPage >= this.totalPages - 1;

    // Get products for current page
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, filtered.length);
    this.products = filtered.slice(startIndex, endIndex);

    console.log(`Page ${this.currentPage + 1}/${this.totalPages}: Showing ${this.products.length} products`);
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
      this.notificationService.warning('Không có dữ liệu để xuất!');
      return;
    }

    try {
      console.log('Exporting', this.allProducts.length, 'products');
      this.excelExportService.exportProductsToExcel(
        this.allProducts,
        'tat-ca-san-pham'
      );
      console.log('✅ Excel export completed successfully');
      this.notificationService.success('Xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export all Excel error:', error);
      this.notificationService.error(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }

  exportFilteredToExcel() {
    console.log('Export filtered products called');
    if (this.filteredProducts.length === 0) {
      this.notificationService.warning('Không có dữ liệu để xuất!');
      return;
    }

    try {
      console.log('Exporting', this.filteredProducts.length, 'filtered products');
      console.log('Filters:', { category: this.selectedCategory, searchTerm: this.searchTerm });
      this.excelExportService.exportProductsToExcel(
        this.filteredProducts,
        'san-pham-da-loc'
      );
      console.log('✅ Excel export completed successfully');
      this.notificationService.success('Xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export filtered Excel error:', error);
      this.notificationService.error(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }

  exportCurrentPageToExcel() {
    console.log('Export current page called');
    if (this.products.length === 0) {
      this.notificationService.warning('Không có dữ liệu để xuất!');
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
      this.notificationService.success('Xuất file Excel thành công! File sẽ được tải xuống tự động.');
    } catch (error: any) {
      console.error('Export current page Excel error:', error);
      this.notificationService.error(error.message || 'Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }
}