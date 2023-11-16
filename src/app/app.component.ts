import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

export interface Tasks {
  id: number,
  title: string,
  completed: boolean
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'My app';


  name = signal('Danilo');

  tasks = signal<Tasks[]>([
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Desayunar',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false
    },

  ]);

  actions = ['All', 'Pending', 'Completed', 'Clear completed'];

  public taskMarked: number | null = null

  public changeHandler(algo: Event) {
    const input = algo.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  public completed(index: number) {
    this.tasks.update((lastState) => lastState.map((task: Tasks, position: number) => {
      if (index == position) {
        return {
          ...task,
          completed: true
        }
      } else {
        return task
      }
    }))
  }

  public addNewElement(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const newValue = input.value;

    const bodyTask: Tasks = {
      id: Date.now(),
      title: newValue,
      completed: false
    }
    this.tasks.update((lastState) => [...lastState, bodyTask]);
  }

  public removeItem(index: number): void {
    this.tasks.update((lastState) => lastState.filter((task, positon) => positon != index));
  }
}
