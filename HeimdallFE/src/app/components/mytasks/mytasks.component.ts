import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {Task} from "../../interfaces/Task";
import {DatePipe} from "@angular/common";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-mytasks',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    DatePipe
  ],
  template:`
    <!--<div class="container mx-auto">
      <h3 class=" flex justify-center text-2xl font-bold mb-4 ">My Tasks</h3>
      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-800 text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Application</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Target</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created at</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (task of myTasks; track task.uuid) {
              @if(task.status !== 'completed')
              {
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                  <a [routerLink]="['/org/application', task?.applicationsInfo?.[0]?.uuid, task.target, createdUuid]"  class="link link-primary">{{ task.description }}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.applicationsInfo?.[0]?.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.score }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.target }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.created_at ? (task.created_at | date: 'dd-MM-yyyy') : '' }}</td>
              </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>-->
  `,
})
export class MytasksComponent {
  taskService = inject(TaskService)
  myTasks = <Task[]>([]);
  createdUuid = '';

  ngOnInit() {
    this.getMyTasks()
    this.createdUuid = uuidv4()
  }

  getMyTasks(): void {
    this.taskService.getAllTasksByUser().subscribe({
      next: (response) => {
        this.myTasks = response;
      },
      error:(error) => {
        console.log(error);
      }
    })
  }
}
