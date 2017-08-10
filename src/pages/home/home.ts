import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url : string = "http://192.168.0.10/ContactRest/api/Contact/contacts";
  isLoading : boolean = false;
  id : number = 0;
  firstName : string = "";
  lastName : string = "";
  public contacts : any;
  actionButton : string = "Add";

  constructor(public navCtrl: NavController, public http: Http, private alertCtrl: AlertController) {
    this.getContacts();
  }

  newContact(){
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    this.actionButton = "Add";
    this.getContacts();
  }

  addEditContact() {
    
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    

    if (this.id == 0){

      let body = JSON.stringify({firstName:this.firstName, lastName:this.lastName});

      this.http.post(this.url, body, options)
        .subscribe(data => {

          this.newContact();

        }, error => {
          this.handleError(error);
        });
    }
    else {

      let body = JSON.stringify({id: this.id, firstName:this.firstName, lastName:this.lastName});

      this.http.put(this.url, body, options)
        .subscribe(data => {

          this.newContact();

        }, error => {
          this.handleError(error);
        });
    }
  }

  getContacts(){
    this.isLoading = true;
    this.http.get(this.url)
      .subscribe(data => {
        var obj = JSON.parse(data['_body']);
        this.contacts = obj.contacts;
        this.isLoading = false;
       }, error => {
        this.handleError(error);
      });
  }

  editContact(contact){
    this.id = contact.id;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.actionButton = "Edit";
  }

  deleteContact(contact){

    this.http.delete(this.url + "?id=" + contact.id)
      .subscribe(data => {
        var obj = JSON.parse(data['_body']);
        console.log("res del >>> " + obj);

        this.getContacts();

       }, error => {
        this.handleError(error);
      });
  }

  presentConfirm(contact) {
    let alert = this.alertCtrl.create({
      title: 'Delete contact?',
      message: contact.firstName + " " + contact.lastName,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteContact(contact);
            console.log('delete clicked');
          }
        }
      ]
    });
    alert.present();
  }

  handleError(error){
    console.log("ERROR: " + error);
  }
}
