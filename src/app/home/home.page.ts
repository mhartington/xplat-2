import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { IonicModule, IonRouterOutlet, ModalController } from '@ionic/angular';
import { EditPage } from '../components/edit/edit.page';

const noop = () => {};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  public notes: FileInfo[] = [];
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {}
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
    console.log(files);
    this.notes = files.sort(
      (a: FileInfo, b: FileInfo) =>
        parseInt(b.name.replace(/note-/, '').replace(/.txt/, '')) -
        parseInt(a.name.replace(/note-/, '').replace(/.txt/, ''))
    );
  }
}
