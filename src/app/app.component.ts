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
        workspace:['a','b','c']
      },
      {
        id:2,
        name:'itemB',
        workspace:['a','b','c']
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
