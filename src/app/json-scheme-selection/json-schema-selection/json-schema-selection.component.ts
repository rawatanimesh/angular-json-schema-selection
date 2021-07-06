import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-json-schema-selection',
  templateUrl: './json-schema-selection.component.html',
  styleUrls: ['./json-schema-selection.component.scss']
})
export class JsonSchemaSelectionComponent implements OnInit {

  @Input() isExpanded = false;
  @Input() jsonSchemaName = '';
  @Input() jsonSchema = {};
  @Output() selectedOutputSchema = new EventEmitter();

  jsonList:any = [];

  constructor() { }

  ngOnInit(): void {
    // this.selectedOutputSchema.emit(this.jsonSchema);
    console.log('json schema', this.jsonSchema);
    this.jsonToList(this.jsonList, this.jsonSchema, true);
    console.log('json list', this.jsonList);
    this.prepareList(this.jsonList,true);
    console.log('prepared json list', this.jsonList);
  }

  prepareList(list:any,isParent:boolean){
    list.forEach((item:any,index:number) =>{
      if(!isParent){
        item.disabled = true;
      }
      if(this.typeof(item.value) === 'array' && item.value.length){
        // item.value = item.value.splice(1);
        item.value.forEach((x:any) => {
          if (!x.type || x.type === 'flat') {
          } else if (x.type === 'object') {
            this.prepareList(x.value,false);
          } else if (x.type === 'array'){
            this.prepareList(x.value,false);
          }
      })
      }
    })
  }

  updateAllCheckItems(list:any){
    // console.log('list',list);
    list.forEach((x:any) => {
        // console.log('item',x);
        if (!x.type || x.type === 'flat') {
          x.checked = this.jsonList.checked;
          if(this.jsonList.checked){
            x.disabled = false;
          }
        } else if (x.type === 'object') {
          x.checked = this.jsonList.checked;
          if(this.jsonList.checked){
            x.disabled = false;
          }
          this.updateAllCheckItems(x.value);
        } else if (x.type === 'array'){
          x.checked = this.jsonList.checked;
          if(this.jsonList.checked){
            x.disabled = false;
          }
          this.updateAllCheckItems(x.value);
        }
    })
  }

  updateItemChecked(event:any,item:any,isAutomatedSelection:boolean){
    console.log(event,item);
    item.checked = event;
    if(isAutomatedSelection && !event){
      item.disabled = true;
      // item.expanded = false;
    }
    else{
      item.disabled = false;
      // item.expanded = true;
    }
    if(this.typeof(item.value) === 'array' && item.value.length){
      item.value.forEach((x:any) => {
        if (!x.type || x.type === 'flat') {
          x.checked = event;
        } else if (x.type === 'object') {
          x.checked = event;
          x.value.forEach((y:any) => {
            this.updateItemChecked(event,y,true);
          })
        } else if (x.type === 'array'){
          x.checked = event;
          x.value.forEach((y:any) => {
            this.updateItemChecked(event,y,true);
          })
        }
    })
    }
  }

  jsonToList(list: Array<any>, json: any, parent?:boolean): void {

    for (const [key, value] of Object.entries(json)) {
      if (this.typeof(value) === 'object' && value) {
        const newList:any = [];
        this.pushData(list, key, newList, 'object');
        this.jsonToList(newList, value);
      } else if (this.typeof(value) === 'array') {
        const newList:any = [];
        // @ts-ignore
        this.checkArray(value, newList);
        this.pushData(list, key, newList, 'array');
      } else {
        this.pushData(list, key, value === null ? 'null' : value, 'flat');
      }
    }
  }

  checkArray(value: Array<any>, newList: Array<any>): void {
    value.forEach((x, index) => {
      if (this.typeof(x) === 'object') {
        const subList:any = [];
        this.pushData(newList, index.toString(), subList, 'object');
        this.jsonToList(subList, x);
      } else if (this.typeof(x) === 'array') {
        const subList:any = [];
        // @ts-ignore
        this.checkArray(x, subList);
        this.pushData(newList, index.toString(), subList, 'array');
      } else {
        this.pushData(newList, index.toString(), x, this.typeof(x));
      }
    });
  }

  typeof(value: any): string {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return 'array';
      } else {
        return 'object';
      }
    }
    return 'flat';
  }

  pushData(list: Array<any>, key: string, value: any, type: string): void {
    list.push({key, value, type, id: this.generateId(), });
  }

  generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  export(): void {
    const json: any = {};
    this.listToJson(this.jsonList, json);
    console.log('output>>>>', json);
    console.log('output JSON>>>>', JSON.stringify(json));
  }

  listToJson(list: Array<any>, json: any): void {
    // console.log(list);
    list.forEach((x) => {
      if (x.checked) {
        if (!x.type || x.type === 'flat') {
          json[x.key] = x.value === 'null' ? null : x.value;
        } else if (x.type === 'object') {
          json[x.key] = {};
          this.listToJson(x.value, json[x.key]);
        } else if (x.type === 'array'){
          json[x.key] = [];
          this.listToJson(x.value, json[x.key]);
        }
      }
    });
  }

}
