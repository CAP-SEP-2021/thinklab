import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import { Router } from '@angular/router';
@Component({
  selector: 'app-authorize-reset-token',
  templateUrl: './authorize-reset-token.component.html',
  styleUrls: ['./authorize-reset-token.component.scss']
})
export class AuthorizeResetTokenComponent implements OnInit {
  token : string;
  username:string;
  constructor(private activatedRoute: ActivatedRoute ,  private router: Router) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.username = params['username'];
      console.log(this.token);
      console.log(this.username);// Print the parameter to the console. 
    });

  }

  ngOnInit(): void {
    setTimeout( ()=>
      this.navigatTorestePassword() , 15000);
  }
navigatTorestePassword(){
  this.router.navigate(['resetPassword']);

}
}
