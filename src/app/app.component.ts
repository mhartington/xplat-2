import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  prefersDark = matchMedia('(prefers-color-scheme: dark)');

  ngOnInit() {
    this.updateStatusbar(this.prefersDark.matches);
    this.prefersDark.addEventListener('change', (e: MediaQueryListEvent) =>
      this.updateStatusbar(e.matches),
    );
  }
  updateStatusbar(matches: boolean): any {
    if (matches) {
      StatusBar.setStyle({ style: Style.Dark });
    } else {
      StatusBar.setStyle({ style: Style.Light });
    }
  }
}
