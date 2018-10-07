import {Component} from '@angular/core';
import {LoadingController, Loading, NavController, NavParams, IonicPage} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {SocialSharing} from '@ionic-native/social-sharing';
import {AngularFireDatabase} from "angularfire2/database";

@IonicPage({
    priority: 'low'
})
@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html'
})
export class PerfilPage {

    pet: any;
    key: string;
    dono: any;
    usuarioAtual: any;
    donoDaPostagem: boolean;
    loading: Loading;

    constructor(public navCtrl: NavController,
                public params: NavParams,
                private afAuth: AngularFireAuth,
                private socialSharing: SocialSharing,
                public loadingCtrl: LoadingController,
                //private afDatabase: AngularFireDatabase
    ) {
        this.pet = params.get('pet') ? params.get('pet') : {};
        this.key = params.get('key') ? params.get('key') : '';

    }

    ionViewDidLoad() {
        //this.afDatabase.object(`profile/${this.pet.user}`).valueChanges().subscribe((user) => {
        //    this.dono = user;
        //    console.log(this.dono);
        //});
        this.afAuth.authState.subscribe(data => {
            if (data && data.email && data.uid) {
                this.usuarioAtual = data.uid;
                if (this.usuarioAtual == this.pet.user) {
                    this.donoDaPostagem = true;
                    console.log(this.donoDaPostagem)
                } else {
                    this.donoDaPostagem = false;
                    console.log(this.usuarioAtual)
                }
            }
        });

    }

    presentWithGif() {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `
                         <div class="custom-spinner-container">
                             <img class="loading" width="200px" height="200px" src="../../assets/chibis-usagi-bow.gif" />
                         </div>`
        });
        this.loading.present();

        setTimeout(() => {
            this.loading.dismiss();
        }, 3000);


    }

    goToChat() {
        if (!this.key && !this.pet.user && !this.usuarioAtual) {
            return false
        }
        let key = this.key;
        let idGrouped = `${this.pet.user}_${this.usuarioAtual}_${key}`;
        console.log(key, this.pet.user);
        this.navCtrl.push('MensagemPage', {
            "key": key,
            "idGrouped": idGrouped,
            "id_interessado": this.usuarioAtual,
            "titulo": this.pet.nome
        });
    }

    whatsappShare() {
        this.socialSharing.shareViaWhatsApp("Olá,meu nome é " + this.pet.nome + " e estou a procura de um dono! :D ", null /*Image*/, " Para me adotar bastar clicar nesse link abaixo e baixar o AdotaPet: " +
            " https://play.google.com/store/apps/details?id=com.labup.adotapet " + " Para ver minha foto acesse: " + this.pet.fotoUrls[0] /* url */)
            .then(() => {
                    console.log("Success");
                },
                () => {
                    console.log("failed")
                })
    }


}
