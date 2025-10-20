// // src/app/admin/services/modal.service.ts
// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root' // Or in admin.module providers
// })
// export class ModalService {
//   private editModalSubject = new Subject<{ isOpen: boolean, product: any }>();
//   editModal$ = this.editModalSubject.asObservable();

//   openEditModal(product: any) {
//     this.editModalSubject.next({ isOpen: true, product });
//   }

//   closeEditModal() {
//     this.editModalSubject.next({ isOpen: false, product: null });
//   }
//   // Add methods for delete similarly
// }