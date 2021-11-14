import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public data: any;
  title = 'fileUpload';
  images: any;
  public frm: any;
  multipleImages = [];
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.data = this.getAll();

  }

  ngOnInit() {
    this.frm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    })
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  selectMultipleImage(event: any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }

  onSubmit() {
    this.frm.controls['file'].setValue(this.images);
    if (this.frm.valid) {
      //more code here
      const formData = new FormData();
      formData.append("data", JSON.stringify(this.frm.value))
      formData.append("file", this.images)
      this.http.post<any>('http://192.168.1.9:3000/file', formData).subscribe(data => {
        console.log(data);
        this.data = this.getAll();
      }
      );

    }


  }

  delete(id: any,file:any): Observable<any> {
    return this.http.delete(`http://192.168.1.9:3000/delete?id=${id}&file=${file}`);
  }

  deleteItem(id: any,file:any) {
    this.delete(id,file).subscribe(data => {
      console.log(data)
      this.data = this.getAll();
    })

  }
  getAll(): Observable<any> {
    return this.http.get("http://192.168.1.9:3000/imgs");
  }

  onMultipleSubmit() {
    const formData = new FormData();
    for (let img of this.multipleImages) {
      formData.append('files', img);
    }

    this.http.post<any>('http://localhost:3000/multipleFiles', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
