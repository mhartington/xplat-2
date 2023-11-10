import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { QuillEditorComponent } from 'ngx-quill';
import { addIcons } from 'ionicons';
import { save, trashBin } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    QuillEditorComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
  ],
})
export class EditPage implements OnInit {
  @Input() name: string | undefined;

  content: string = '';

  private modalCtrl = inject(ModalController);

  constructor() {
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
}
