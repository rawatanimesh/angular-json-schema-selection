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
    flatArray:['a','b','c'],
    itemList:[
      {
        id:1,
        name:'itemA',
        workspace:[
            {
            firstName:'Akshat',
            lastName:{
              firstName:'Akshat',
              lastName:'Rathi',
            },
          }
        ]
      },
      {
        id:2,
        name:'itemB',
        workspace:[
          {
            firstName:'Akshat',
            lastName:{
              firstName:'Akshat',
              lastName:'Rathi',
            },
          }
        ]
      }
    ],
    creator:{
      firstName:'Akshat',
      lastName:'Rathi',
    },
    lastModifier:{
      userName: 'Sample Name',
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
