import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTelegram, faVk, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FaIconComponent, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public faTelegram = faTelegram;
  public faVk = faVk;
  public faFacebookF = faFacebookF;
  public faInstagram = faInstagram;
  public social = [
    {name: 'Telegram', link: '/', icon: faTelegram, class: 'footer__link--tg'},
    {name: 'Vk', link: '/', icon: faVk, class: 'footer__link--vk'},
    {name: 'Facebook', link: '/', icon: faFacebookF, class: 'footer__link--fb'},
    {name: 'Instagram', link: '/', icon: faInstagram, class: 'footer__link--inst'},
  ]
}
