import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-alert-dialog',
  templateUrl: './custom-alert-dialog.component.html',
  styleUrls: ['./custom-alert-dialog.component.css']
})
export class CustomAlertDialogComponent {

  title: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<CustomAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
