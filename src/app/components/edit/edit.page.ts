import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, QuillModule],
})
export class EditPage implements OnInit {
  @Input() name: string | undefined;
  content: string = '';

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
    ],
  };
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}
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
