import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiService} from "./api.service";
import {Team} from "../interfaces/Team.interface";
import {TeamDetails} from "../interfaces/team-details";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiService{

  private apiUrl = "http://localhost:8082/api/teams";

  http = inject(HttpClient)
  header= this.createHeader();
  private teamSignal: WritableSignal<Team[]> = signal([])
  constructor(){
    super();
  }

  getAllTeamsByOrganizationUuid(uuid: String): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl + '/organization/' + uuid, { headers: this.header })
  }

  get teams(){
    return this.teamSignal.asReadonly();
  }

  getOwnTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(this.apiUrl + "/user", { headers: this.header })
  }

  getAllTeamsByUser(): void{
    this.http.get<Team[]>(this.apiUrl + "/user", { headers: this.header }).subscribe({
      next: (teams) => {
        this.teamSignal.set(teams)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(this.apiUrl, { headers: this.header })
  }

  createTeam(team: Team): Observable<Team>
  {
    const body = JSON.stringify(team);
    return this.http.put<Team>(this.apiUrl, body, { headers: this.header })
  }
  getTeam(uuid: string): Observable<Team>{
    return this.http.get<Team>(this.apiUrl + '/' + uuid, { headers: this.header })
  }
  getTeamDetails(uuid: string): Observable<TeamDetails>{
    return this.http.get<TeamDetails>(this.apiUrl + '/details/' + uuid, { headers: this.header })
  }

  assignResponsibleUser(team_uuid: string, user_id: string, application_uuid: String)
  {
    let body = {
      team_uuid: team_uuid,
      user_id: user_id,
      application_uuid: application_uuid
    }
    return this.http.post(this.apiUrl + '/assign-user', body, { headers: this.header })
  }

  addMemberToTeam(team_uuid: string, user_id: string) {
    let body = {
      team_uuid: team_uuid,
      user_id: user_id
    }
    return this.http.post(this.apiUrl + '/add-member', { team_uuid: team_uuid, user_id: user_id }, { headers: this.header })
  }

  deleteMemberFromTeam(team_uuid: string, user_id: string) {
    return this.http.delete(this.apiUrl + '/delete-member/' + team_uuid + '/' + user_id, { headers: this.header })
  }

}
