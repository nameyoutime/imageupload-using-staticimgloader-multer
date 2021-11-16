import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';

  public endpoint: any = environment.endpoint
  public data: any;
  images: any;
  public frm: any;
  multipleImages = [];
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.data = this.getAll();
    this.getAll().subscribe(data=>{
      console.log(data);
    })

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
      const file = event.target.files;
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
      for (let img of this.images) {
        formData.append('files', img);
      }
      // formData.append("file",this.images )
      this.http.post<any>(environment.endpoint+'files', formData).subscribe(data => {
        console.log(data);
        this.data = this.getAll();
      }
      );

    }


  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${environment.endpoint}delete?id=${id}`);
  }

  deleteItem(id: any) {
    this.delete(id).subscribe(data => {
      console.log(data)
      this.data = this.getAll();
    })

  }
  getAll(): Observable<any> {
    return this.http.get(environment.endpoint+"imgs");
  }

  onMultipleSubmit() {
    const formData = new FormData();
    for (let img of this.multipleImages) {
      formData.append('files', img);
    }

    this.http.post<any>(environment.endpoint+'files', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
