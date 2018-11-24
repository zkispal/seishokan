import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-rregister',
  templateUrl: './rregister.component.html',
  styleUrls: ['./rregister.component.css']
})
export class RregisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted: false;
  firstName = 'Keresztnév';
  lastName = 'Vezetéknév';
  password = '';
  confirmPassword= '';
  email = 'valaki@valahol.hu';
  date = new Date();


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: [this.firstName, Validators.required],
      lastName: [this.lastName, Validators.required],
      email: [this.email, [Validators.email, Validators.required]],
      password: [this.password, [Validators.required, Validators.minLength(6), Validators.maxLength(45)]],
      confirmPassword: [this.confirmPassword, [Validators.required, Validators.minLength(6), Validators.maxLength(45)]],
      date: [this.date, Validators.required]
      },
      {}
    );
  }

  onSubmit() {
    console.log(this.registerForm);
  }


}
