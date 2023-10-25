import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { EditPage } from '../components/edit/edit.page';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';

const noop = () => {};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
  ],
})
export class HomePage {
  public notes = signal<FileInfo[]>([]);
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
  ) {
    addIcons({ add, trash });
  }
  async ngOnInit(): Promise<void> {
    await Filesystem.requestPermissions();
    await this.initFileSystem();
  }

  async initFileSystem() {
    await this.makeDir().then(noop, noop);
    await this.readDir();
  }

  async edit(fileName?: string) {
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps: {
        name: fileName ?? null,
      },
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
    modal.onWillDismiss().then(() => {
      this.readDir();
    });
  }

  async makeDir(): Promise<void> {
    await Filesystem.mkdir({
      directory: Directory.Documents,
      path: 'notes',
    });
  }

  async readDir(): Promise<void> {
    const { files } = await Filesystem.readdir({
      directory: Directory.Documents,
      path: 'notes',
    });
    this.notes.set(
      files.sort(
        (a: FileInfo, b: FileInfo) =>
          parseInt(b.name.replace(/note-/, '').replace(/.txt/, '')) -
          parseInt(a.name.replace(/note-/, '').replace(/.txt/, '')),
      ),
    );
  }

  async delete(note: FileInfo) {
    await Filesystem.deleteFile({
      path: `notes/${note.name}`,
      directory: Directory.Documents,
    });
    await this.readDir();
  }
}
