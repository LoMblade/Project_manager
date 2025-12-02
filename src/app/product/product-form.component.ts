import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]   
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    code: '',
    name: '',
    importPrice: 0,
    salePrice: 0,
    description: '',
    image: ''
  };
  isEdit = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route params:', this.route.snapshot.paramMap);
    console.log('ID from route:', id);

    if (id) {
      this.isEdit = true;
      console.log('Loading product with id:', id, 'parsed as:', +id);

      // Check if ID is valid
      const numericId = +id;
      if (isNaN(numericId)) {
        console.error('Invalid ID format:', id);
        alert('ID sản phẩm không hợp lệ!');
        this.router.navigate(['/']);
        return;
      }

      this.productService.getById(numericId).subscribe({
        next: (p) => {
          console.log('Successfully loaded product:', p);
          if (p) {
            this.product = p;
            // Load image preview if exists
            if (p.image) {
              this.selectedImage = p.image;
            }
          } else {
            console.error('Product not found (null response)');
            alert('Không tìm thấy sản phẩm!');
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Error loading product:', err);
          alert('Không tìm thấy sản phẩm!');
          this.router.navigate(['/']);
        }
      });
    }
  }

  onSubmit() {
    console.log('Submitting product:', this.product);
    console.log('Is edit mode:', this.isEdit);

    const action = this.isEdit && this.product.id
      ? this.productService.update(this.product.id, this.product)
      : this.productService.create(this.product);

    action.subscribe({
      next: (result) => {
        console.log('Submit result:', result);
        alert(this.isEdit ? 'Cập nhật thành công!' : 'Thêm hàng hóa thành công!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Submit error:', err);
        alert('Có lỗi xảy ra!');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  // Image handling methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        // Convert to base64 for storage
        this.product.image = this.selectedImage!;
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.product.image = '';
  }
}