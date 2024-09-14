import { Component, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, collectionGroup, updateDoc, CollectionReference, } from 'firebase/firestore/lite';
import { tasksResponse } from './models/takslist.model';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';

@Component({
  selector: 'lib-my-lib',
  template: `
    <div class="p-5">
      <div>
        <button class="btn btn-primary float-end" (click)="openTaskFrom()">
          Add Task
        </button>
      </div>
      <div class="mt-4 container-fluid">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Due Date</th>
              <th scope="col">Description</th>
              <th scope="col">Attachment</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let eachTask of tasksList; let i = index">
              <th scope="row">{{ i + 1 }}</th>
              <td>{{ eachTask.title }}</td>
              <td>{{ eachTask.due_date }}</td>
              <td>{{ eachTask.description }}</td>
              <td>{{ eachTask.attachment }}</td>
              <td>
                <button class="btn btn-primary" (click)="openUpdateform(eachTask, i)">
                  Edit
                </button>
                <button class="btn btn-danger" (click)="deleteTask(i, eachTask)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="container mt-5" *ngIf="showAddForm" >
        <div class="card p-4" >
          <form [formGroup]="addTaskFrom" >
            <div class="row">
              <div class="col">
                <label for="exampleInputEmail1">Title</label>
                <input type="text" class="form-control" formControlName="title" placeholder="Enter title">
                <small *ngIf="submitted && addTaskFrom.controls.title.hasError('required')" class="form-text text-danger">Please enter task title.</small>
              </div>
              <div class="col">
              <label for="exampleInputEmail1">Due Date</label>
                <input type="date" class="form-control" formControlName="due_date" placeholder="Select Due Date">
                <small *ngIf="submitted && addTaskFrom.controls.due_date.hasError('required')" class="form-text text-danger">Please select due date.</small>
              </div>
            </div>
            <div class="row">
              <div class="col">
              <label for="exampleInputEmail1">Description</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
              <small *ngIf="submitted && addTaskFrom.controls.description.hasError('required')" class="form-text text-danger">Please enter description.</small>
              </div>
              <div class="col">
              <label for="exampleInputEmail1">Attachment</label>
              <input type="file" class="form-control" formControlName="attachment" placeholder="Please upload attachment">
              <small *ngIf="submitted && addTaskFrom.controls.attachment.hasError('required')" class="form-text text-danger">Please upload attchment.</small>
              </div>
            </div>
          </form>
          <div class="row justify-content-center" >
            <div class="col-md-3" >
            <button type="submit" (click)="addNewTask()" class="btn btn-success mt-4">{{actionType == 'update' ? 'Update' : 'Add'}} Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyLibComponent implements OnInit {
  private firebaseConfig = {
    apiKey: 'AIzaSyDpfLJPyUXBDnRUGuAJrx7iQwJ4kfy5pQE',
    authDomain: 'todolist-task-b5fc5.firebaseapp.com',
    databaseURL: 'https://todolist-task-b5fc5-default-rtdb.firebaseio.com',
    projectId: 'todolist-task-b5fc5',
    storageBucket: 'todolist-task-b5fc5.appspot.com',
    messagingSenderId: '270324005179',
    appId: '1:270324005179:web:21f84e11e00c950b371f1e',
    measurementId: 'G-6EXW32PN56',
  };
  private app: FirebaseApp;
  private db: any;
  public tasksList: any = [];
  showAddForm: boolean = false;
  addTaskFrom!: FormGroup;
  submitted: boolean = false;
  taskSnapshot: any;
  selectedIndex: number = 0;
  constructor(private formBuilder: FormBuilder) {
    this.app = initializeApp(this.firebaseConfig);
    if (!this.app) {
      console.log('Firebase App Not Initilized');
    } else {
      console.log('Firebase App Initialized', this.app);
      this.db = getFirestore(this.app);
      this.getTasks();
    }
  }

  initForm(){
    this.addTaskFrom = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      attachment: ['', Validators.required],
      due_date: ['', Validators.required],
    })
  }

  async getTasks() {
    const tasksCol = collection(this.db, 'task');
    this.taskSnapshot = await getDocs(tasksCol);
    this.tasksList = this.taskSnapshot.docs.map((doc: any) => doc.data());
  }
  ngOnInit(): void {
    this.initForm();
  }


  async deleteTask(indexRef: any, eachTask: any) {
    console.log(indexRef)    
    const tasksCol = collection(this.db, 'task');
    const newShot = await getDocs(tasksCol);
    let taskRef: any;
    taskRef = newShot.docs.find((doc, index) => indexRef == index)?.ref;
    console.log(taskRef)
    await deleteDoc(taskRef);
    this.getTasks();
    // const docRef = doc(this.db, 'task', eactItem);
    // const docCollections = collectionGroup(this.db, 'task');
    // console.log(docCollections,get)
    // let taskRef = this.taskSnapshot.docs.map((doc: any, i = index) => {
    //   i == indexRef ? doc.id : ''
    // });
    // const taskSnapshot = await deleteDoc(taskRef);
  }

  openTaskFrom() {
    this.showAddForm = true;
    console.log('Add New Task');
  }
  openUpdateform(taskObj: any, index: number){
    console.log(taskObj);
    this.selectedIndex = index;
    this.actionType = 'update';
    this.addTaskFrom.patchValue({
      attachment: '',
      due_date: taskObj?.due_date,
      description: taskObj?.description,
      title: taskObj?.title
    })
    this.showAddForm= true;
  }
  actionType: string = 'add';
  addNewTask(){
    console.log(this.actionType)
    this.submitted = true;
    if(this.addTaskFrom.valid){
      let payload = this.addTaskFrom.value;
      if(this.actionType == 'update'){
        this.updateTask(payload)
      }else if(this.actionType == 'add'){
        this.createtask(payload)
      }
    }
  }

  async createtask(taskObj: any) {
    const tasksCol = collection(this.db, 'task');
    const taskSnapshot = await addDoc(tasksCol, taskObj);
    if(taskSnapshot){
      this.showAddForm = false;
      this.addTaskFrom.reset();
      this.getTasks();
    }
    // this.tasksList = taskSnapshot.docs.map((doc) => doc.data());
  }

  async updateTask(taskObj: any) {
    const tasksCol = collection(this.db, 'task');
    const newShot = await getDocs(tasksCol);
    let taskRef: any;
    taskRef = newShot.docs.find((doc, index) => this.selectedIndex == index)?.ref;
    console.log(taskRef)
    const taskSnapshot = await updateDoc(taskRef, taskObj);
      this.showAddForm = false;
      this.addTaskFrom.reset();
      this.getTasks();
    
    // console.log(taskSnapshot);
    // if(taskSnapshot){
    //   this.showAddForm = false;
    //   this.addTaskFrom.reset();
    //   this.getTasks();
    // }
    // this.tasksList = taskSnapshot.docs.map((doc) => doc.data());
  }
  
}
