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
    description: ''
  };
  isEdit = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productService.getById(+id).subscribe(p => {
        this.product = p;
      });
    }
  }

  onSubmit() {
    const action = this.isEdit && this.product.id
      ? this.productService.update(this.product.id, this.product)
      : this.productService.create(this.product);

    action.subscribe({
      next: () => {
        alert(this.isEdit ? 'Cập nhật thành công!' : 'Thêm hàng hóa thành công!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra!');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}