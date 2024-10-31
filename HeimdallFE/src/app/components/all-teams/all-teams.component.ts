import {Component, inject, effect} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Team} from "../../interfaces/Team.interface";
import {TeamService} from "../../services/team.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-all-teams',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './all-teams.component.html'
})
export class AllTeamsComponent {
  teamsService = inject(TeamService)
  userService = inject(UserService)
  teams = <Team[]>([]);
  myTeams = <Team[]>([]);
  spocNames: { [key: string]: string } = {};

  constructor() {
    effect(() => {
      this.myTeams = this.teamsService.teams();
    });
    }

  ngOnInit() {
    this.getMyTeams()
    this.getTeams()
  }

  getTeams(): void {
    this.teamsService.getAllTeamsByOrganizationUuid('ace2e137-d6e7-4476-9bc4-5c7a23c17ddd').subscribe({
      next: (response: Team[]) => {
        this.teams = response;
        this.loadSpocNames(this.teams);
      },
      error:(error) => {
        console.log(error);
      }
    })
  }
  getMyTeams(): void {
    this.teamsService.getAllTeamsByUser();
  }

  loadSpocNames(teams: Team[]): void {
    teams.forEach(team => {
      if (team.spoc) {
        this.userService.getUserByID(team.spoc).subscribe({
          next: (response) => {
            this.spocNames[team.spoc!] = response.name;
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  getSpocName(uuid: string): string {
    return this.spocNames[uuid] || 'N/A';
  }
}
