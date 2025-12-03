import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportProductsToExcel(products: Product[], filename: string = 'danh-sach-san-pham') {
    try {
      console.log('Bắt đầu xuất Excel với', products.length, 'sản phẩm');

      if (!products || products.length === 0) {
        throw new Error('Không có dữ liệu để xuất');
      }

      // Cảnh báo nếu dữ liệu quá lớn
      if (products.length > 500) {
        console.warn('⚠️ Dữ liệu lớn (>500 sản phẩm), có thể gặp vấn đề với một số browser');
      }

      // Chuẩn bị dữ liệu cho Excel (tối ưu hóa để giảm kích thước)
      const excelData = products.map(product => ({
        'Mã SP': product.code,
        'Tên SP': product.name,
        'Danh mục': product.category || '',
        'Giá nhập': product.importPrice,
        'Giá bán': product.salePrice,
        'Mô tả': (product.description || '').substring(0, 100), // Giới hạn độ dài mô tả
        'Hình ảnh': product.image ? 'Có' : 'Không' // Đơn giản hóa cột hình ảnh
      }));

      console.log('Dữ liệu Excel đã chuẩn bị:', excelData.length, 'bản ghi');

      // Tạo workbook và worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

      // Tự động điều chỉnh độ rộng cột (tối ưu)
      const columnWidths = [
        { wch: 12 }, // Mã SP
        { wch: 25 }, // Tên SP
        { wch: 12 }, // Danh mục
        { wch: 10 }, // Giá nhập
        { wch: 10 }, // Giá bán
        { wch: 30 }, // Mô tả
        { wch: 8 }   // Hình ảnh
      ];
      worksheet['!cols'] = columnWidths;

      // Tạo workbook
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Danh sách sản phẩm': worksheet },
        SheetNames: ['Danh sách sản phẩm']
      };

      console.log('Workbook đã tạo thành công');

      // Xuất file - sử dụng phương pháp đáng tin cậy nhất
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      console.log('Excel buffer đã tạo, size:', excelBuffer.byteLength || excelBuffer.length, 'bytes');

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fullFilename = `${filename}_${timestamp}.xlsx`;

      console.log('Tên file:', fullFilename);

      // Method 1: Sử dụng Blob và URL.createObjectURL (đáng tin cậy nhất)
      try {
        // Xử lý excelBuffer một cách type-safe
        let data: ArrayBuffer | Uint8Array;

        if (excelBuffer instanceof ArrayBuffer) {
          data = excelBuffer;
        } else if (excelBuffer instanceof Uint8Array) {
          data = excelBuffer;
        } else if (Array.isArray(excelBuffer)) {
          // Chuyển array thành Uint8Array với type assertion
          data = new Uint8Array(excelBuffer as number[]);
        } else {
          // Fallback: ép kiểu an toàn
          data = excelBuffer as ArrayBuffer;
        }

        console.log('Data type:', data.constructor.name, 'Size:', 'length' in data ? data.length : data.byteLength);

        // Tạo Blob với type assertion để tránh lỗi TypeScript
        const blob = new Blob([data as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        console.log('Blob size:', blob.size);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fullFilename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up URL object
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);

        console.log('✅ File đã được download thành công bằng Blob method');
        return true;

      } catch (blobError) {
        console.warn('❌ Blob method thất bại:', blobError);

        // Method 2: Fallback với file-saver
        try {
          let data: Blob;
          if (excelBuffer instanceof Uint8Array) {
            data = new Blob([excelBuffer as any], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          } else {
            data = new Blob([excelBuffer as any], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          }

          saveAs(data, fullFilename);
          console.log('✅ File đã được download thành công bằng file-saver');
          return true;

        } catch (saveError) {
          console.error('❌ File-saver cũng thất bại:', saveError);
          throw new Error('Không thể xuất file Excel. Browser không hỗ trợ download file. Hãy thử browser khác (Chrome, Firefox, Edge).');
        }
      }

    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      throw new Error('Không thể xuất file Excel. Vui lòng thử lại.');
    }
  }

}
