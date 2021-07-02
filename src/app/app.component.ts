import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit{
  isExpanded = false;
  jsonSchemaName = 'TemplateList';


  jsonSchema = {
    category:'GridData',
    envType:'RCP',
    id:235,
    name:'testdataRCP',
    itemList:[
      {
        id:1,
        name:'itemA'
      },
      {
        id:2,
        name:'itemB'
      }
    ],
    creator:{
      firstName:'Akshat',
      lastName:'Rathi',
    },
    lastModifier:{
      userName: '',
      workspace:{
        id:235,
        name:'Current',
      }
    }
  }

  ngOnInit(): void {
  }

  outputSchema(event:any){
    console.log(event);
  }
}
