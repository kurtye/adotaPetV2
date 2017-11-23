import {Component} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {FCM} from '@ionic-native/fcm';

import {LoginPage} from '../pages/login/login';
import {TabsControllerPage} from "../pages/tabs-controller/tabs-controller";
import {ChatPage} from "../pages/chat/chat";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private ga: GoogleAnalytics, public fcm: FCM) {
    this.fcm.getToken().then(token => {
      localStorage.setItem('token', token);
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      localStorage.setItem('token', token);
    });
    this.ga.startTrackerWithId('AIzaSyAgCuNyINj93Qo3sB0ghvKxGfAwxuxSnqE')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('test');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

    const skipIntro = localStorage.getItem('skipIntro');
    console.log(skipIntro);
    if (skipIntro) {
      this.rootPage = TabsControllerPage;
    } else {
      this.rootPage = LoginPage;
    }
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        this.rootPage = ChatPage;
      }else{
        alert(data);
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
