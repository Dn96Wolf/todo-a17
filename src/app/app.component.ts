import { Component, Injector, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

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

export class AppComponent implements OnInit {
  public title: string = 'My app';
  public tasks = signal<Tasks[]>([
    {
      id: Date.now(),
      title: 'Tarea 1',
      completed: true,
      editing: false
    },
    {
      id: Date.now(),
      title: 'Desayunar',
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

  public newWidth = signal<number>(300);
  public filterState = signal<string>('all');
  public filterActive: number = 0;
  public taskByFilter = computed(() => {
    //elementos que reaccionan cuando uno u otro cambia.
    //queda un nuevo estado a partir de los estados vigialdos dentro 
    //de esta funcion.
    //todo lo que cambien dentro de las senales
    //computed siempre retorna una nueva senal a partir de otra
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

  injector = inject(Injector);

  constructor() {
    //efect es un vigilante de reactividad 
    //cuando una senal cambia se ejecuta algo en particular pero no regresa un valor
  }


  ngOnInit(): void {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      const listTasks = JSON.parse(tasks);
      this.tasks.set(listTasks);
    }
    this.trackTasks();
  }

  public trackTasks() {
    //efect es un vigilante de reactividad 
    //cuando una senal cambia se ejecuta algo en particular pero no regresa un valor
    effect(() => {
      const task = this.tasks();
      //cada que pongamos una senal este la detecta y actua
      localStorage.setItem('tasks', JSON.stringify(task));
    }, { injector: this.injector })
    //en este caso se usa el injector del core para cuando no se 
    //agrega el effect dentro del costructor 
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


  public changeFilter(state: string, index: number): void {
    this.filterActive = index;
    this.filterState.set(state.toLowerCase());
  }

  public deleteCompleted(): void {
    this.tasks.update((lastState) => lastState.filter((task:Tasks) => !task.completed));
  }

}
