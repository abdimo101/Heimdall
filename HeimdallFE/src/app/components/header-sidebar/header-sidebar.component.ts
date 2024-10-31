import {Component, effect, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {KeycloakService} from "../../services/keycloak.service";
import {TeamService} from "../../services/team.service";
import {UserService} from "../../services/user.service";
import {NotificationService} from "../../services/notification.service";
import {Team} from "../../interfaces/Team.interface";
import {Notification} from "../../interfaces/Notification.interface";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgOptimizedImage
  ],
  templateUrl: './header-sidebar.component.html'
})
export class HeaderSidebarComponent {
  keycloak: KeycloakService;
  myTeams = <Team[]>([]);
  myNotifications = <Notification[]>([]);
  limitedNotifications: Notification[] = [];
  unseenCount = 0;
  constructor(keycloak: KeycloakService, private router: Router) {
    this.keycloak = keycloak;

    effect(() => {
      if (this.notificationService.notifications()) {
        this.myNotifications = this.notificationService.notifications();
        this.limitedNotifications = this.myNotifications.slice(0, 5);
        this.unseenCount = this.myNotifications.filter(notification => notification.seen_at === null).length;
      }
    });

    effect(() => {
      if (this.teamService.teams()){
        this.myTeams = this.teamService.teams();
        }
    })
  }
  ngOnInit() {
    this.getMyTeams()
    this.getMyNotifications()
  }
  teamService = inject(TeamService)
  userService = inject(UserService)
  notificationService = inject(NotificationService)

  getMyTeams(): void {
    this.teamService.getAllTeamsByUser();
  }

  getMyNotifications(): void {
    this.notificationService.getNotifications();
  }

  formatNotification(notification: Notification): string {
    return `${notification.app_name} ${notification.title}<br>Date: ${notification.created_at}`;
  }

  markNotificationsAsSeen(): void {
    this.myNotifications.forEach(notification => {
      if (!notification.seen_at) {
        this.notificationService.updateSeenAt(notification.uuid).subscribe({
          next: () => {
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
    this.unseenCount = 0;
  }
}
