import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { retry, single } from 'rxjs';

export interface Tasks {
  id: number,
  title: string,
  completed: boolean,
  editing?: boolean
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  public title: string = 'My app';
  public name = signal('Danilo');
  public tasks = signal<Tasks[]>([
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: true,
      editing: false
    },
    {
      id: Date.now(),
      title: 'Desayunar',
      completed: false,
      editing: false
    },
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
      editing: false
    },

  ]);

  public newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public widthModify = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public newWidth = signal(300);
  public filterState = signal('all');
  public taskByFilter = computed(() => {
    //elementos que reaccionan cuando uno u otro cambia.
    //queda un nuevo estado a partir de los estados vigialdos dentro 
    //de esta funcion.
    //todo lo que cambien dentro de las senales
    const filter = this.filterState();
    const task = this.tasks();
    if (filter === 'pending') {
      return task.filter(task => !task.completed)
    }
    if (filter === 'completed') {
      return task.filter(task => task.completed)
    }
    return task;
  });

  public actions = ['All', 'Pending', 'Completed'];
  public taskMarked: number | null = null;
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
          completed: !task.completed
        }
      } else {
        return task
      }
    }))
  }

  public addNewElement() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        const bodyTask: Tasks = {
          id: Date.now(),
          title: this.newTaskCtrl.value,
          completed: false
        }
        this.tasks.update((lastState) => [...lastState, bodyTask]);
        this.newTaskCtrl.setValue('')
      }
    }
  }

  public removeItem(index: number): void {
    this.tasks.update((lastState) => lastState.filter((task, positon) => positon != index));
  }


  public newLength(): void {
    if (this.widthModify.valid) {
      const value = parseInt(this.widthModify.value, 10)
      this.newWidth.set(value)
    }
  }

  public editTask(id: number) {
    this.tasks.update((lastState) => lastState.map((task: Tasks, position: number) => {
      if (id == position && !task.completed) {
        return {
          ...task,
          editing: true
        }
      } else {
        return task
      }
    }))
  }

  public newValueTask(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((lastState) => lastState.map((task: Tasks, position: number) => {
      if (id == position) {
        return {
          ...task,
          title: input.value,
          editing: false,
        }
      } else {
        return task
      }
    }))
  }


  public changeFilter(state: string): void {
    console.log('el estado', state)
    this.filterState.set(state.toLowerCase());
  }

}
