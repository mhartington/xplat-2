import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { QuillModule } from 'ngx-quill';
import { addIcons } from "ionicons";
import { save, trashBin } from "ionicons/icons";
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, QuillModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent],
})
export class EditPage implements OnInit {
    @Input() name: string | undefined;
    content: string = '';

    constructor(
        private alertCtrl: AlertController,
        private modalCtrl: ModalController
    ) {
        addIcons({ save, trashBin });
    }
    async ngOnInit() {
        if (this.name) {
            const { data } = await Filesystem.readFile({
                path: `notes/${this.name}`,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            this.content = data;
        }
    }

    async save() {
        const fileName = this.name ?? `notes-${Date.now()}.txt`;
        await this.write(fileName);
        return;
    }
    async write(file: string) {
        await Filesystem.writeFile({
            path: `notes/${file}`,
            data: this.content || '',
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        await this.modalCtrl.dismiss();
    }
    async delete() {
        if (this.name) {
            await Filesystem.deleteFile({
                path: `notes/${this.name}`,
                directory: Directory.Documents,
            });
            await this.modalCtrl.dismiss();
        }
    }
    async nameNoteAlert() {
        const namePrompt = await this.alertCtrl.create({
            header: 'Name',
            message: 'what do you want to call this?',
            inputs: [{ name: 'fileName', placeholder: 'Name' }],
            buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Save' }],
        });
        await namePrompt.present();
        return await namePrompt.onWillDismiss();
    }
}
