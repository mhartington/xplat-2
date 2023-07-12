import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  prefersDark = matchMedia('(prefers-color-scheme: dark)');

  ngOnInit() {
    this.updateStatusbar(this.prefersDark.matches);
    this.prefersDark.addEventListener('change', (e: MediaQueryListEvent) =>
      this.updateStatusbar(e.matches)
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
