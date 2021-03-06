import {Component} from '@angular/core';
import {LoadingController, Loading, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "@angular/fire/auth";
import {SocialSharing} from '@ionic-native/social-sharing';
import {AngularFireDatabase} from "@angular/fire/database";
import {MensagemPage} from "../mensagem/mensagem";
import {PostProvider} from "../../providers/post/post";

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  pet: any;
  dono: any;
  usuarioAtual: any = false;
  donoDaPostagem: boolean;
  loading: Loading;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private afAuth: AngularFireAuth,
              public afDb: AngularFireDatabase,
              private socialSharing: SocialSharing,
              public loadingCtrl: LoadingController,
              private postProvider: PostProvider
  ) {
    this.pet = params.get('pet') ? params.get('pet') : {};
  }

  ionViewDidLoad() {
    this.afDb.object(`profile/${this.pet.user}`).valueChanges().subscribe((dono: any) => {
      this.dono = dono.nome;
      console.log(this.dono);

    });

    this.afAuth.authState.subscribe(data => {
      console.log('auth state', data);

      if (data && data.email && data.uid) {
        this.usuarioAtual = data.uid;
        if (this.usuarioAtual == this.pet.user) {
          this.donoDaPostagem = true;
          console.log(this.donoDaPostagem)
        } else {
          this.donoDaPostagem = false;
          console.log(this.usuarioAtual)
        }
      } else {
        this.usuarioAtual = false;
        console.log('nao logado', this.usuarioAtual);
      }
    });

  }

  goToChat() {
    if (!this.pet.key && !this.pet.user && !this.usuarioAtual) {
      return false
    }
    this.navCtrl.push(MensagemPage, {
      'pet': this.pet
    });
  }

  whatsappShare() {
    this.postProvider.shorUrl(this.pet.fotoUrls[0]).subscribe(url => {
      console.log(url);
      this.socialSharing.shareViaWhatsApp(`Olá, meu nome é ${this.pet.nome} e estou a procura de um dono! :D `, null /*Image*/, " Para me adotar bastar clicar nesse link abaixo e baixar o AdotaPet GO: " +
        "https://adotapetgo.page.link/bCK1" + " Para ver minha foto acesse: " + url.shortLink)
        .then(() => {
            console.log("Success");
          },
          () => {
            console.log("failed")
          })
    });
  }


}
