import { Component, Input, OnInit, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-json-schema-selection',
  templateUrl: './json-schema-selection.component.html',
  styleUrls: ['./json-schema-selection.component.scss']
})
export class JsonSchemaSelectionComponent implements OnInit,OnChanges {

  @Input() isExpanded = false;
  @Input() jsonSchemaName = '';
  @Input() jsonSchema = {};
  @Output() selectedOutputSchema = new EventEmitter();

  jsonList:any = [];
  jsonSchemaCopy = {};

  constructor() { }

  ngOnInit(): void {
    // this.selectedOutputSchema.emit(this.jsonSchema);
    this.jsonSchemaCopy = JSON.parse(JSON.stringify(this.jsonSchema));
    console.log('json schema', this.jsonSchemaCopy);
    this.jsonToList(this.jsonList, this.jsonSchema, true);
    console.log('json list', this.jsonList);
    this.prepareList(this.jsonList,true);
    console.log('prepared json list', this.jsonList);
  }

  ngOnChanges(changes:SimpleChanges){
    // console.log(changes.isExpanded)
    if(changes.isExpanded){
      this.isExpanded = changes.isExpanded.currentValue;
      this.toggleExpansion(this.jsonList,this.isExpanded);
    }
  }

  prepareList(list:any,isParent:boolean){
    list.forEach((item:any,index:number) =>{
      item.disabled = true;
      if(!isParent){
        // item.disabled = true;
      }
      if(this.typeof(item.value) === 'array' && item.value.length){
        // item.value = item.value.splice(1);
        item.value.forEach((x:any) => {
          if (!x.type || x.type === 'flat') {
          } else if (x.type === 'object') {
            x.disabled = true;
            this.prepareList(x.value,false);
          } else if (x.type === 'array'){
            this.prepareList(x.value,false);
          }
      })
      }
    })
  }
  checkCount = 0;
  updateAllCheckItems(list:any){
    // console.log('list',list);
    list.forEach((x:any) => {
        // console.log('item',x);
        x.checked = this.jsonList.checked;
        if(this.jsonList.checked){
          x.disabled = false;
        }
        else{
          x.disabled = true;
        }
        if (!x.type || x.type === 'flat') {

        } else if (x.type === 'object') {
          if(x.checked){
            this.checkCount++;
          }
          else{
            this.checkCount--;
          }
          // x.checked = this.jsonList.checked;
          this.updateAllCheckItems(x.value);
        } else if (x.type === 'array'){
          if(x.checked){
            this.checkCount++;
          }
          else{
            this.checkCount--;
          }
          // x.checked = this.jsonList.checked;
          this.updateAllCheckItems(x.value);
        }
    })
  }

  updateItemChecked(event:any,item:any,isAutomatedSelection:boolean){
    console.log(event,item);
    item.checked = event;
    if(item.checked && item.type !== 'flat'){
      this.checkCount++;
    }
    else if(!item.checked && item.type !== 'flat'){
      this.checkCount--;
    }
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
          if(!event){
            x.disabled = true;
          }
          else{
            x.disabled = false;
          }
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
        // console.log(value);
        var tempArray:any = value;
        if(tempArray.length>1){
          tempArray.splice(1);
          // console.log(value,tempArray.splice(1))
        }
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
    this.selectedOutputSchema.emit(json);
    // console.log('output>>>>', json);
    // console.log('output JSON>>>>', JSON.stringify(json));
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

  toggleExpansion(list:any,expand:boolean){
    list.expanded = expand;
    list.forEach((item:any,index:number) =>{
      // console.log(item);
      item.expanded = expand;
      if(this.typeof(item.value) === 'array' && item.value.length){
        item.value.forEach((x:any) => {
          if (!x.type || x.type === 'flat') {
          } else if (x.type === 'object') {
            x.expanded = expand;
            this.toggleExpansion(x.value,expand);
          } else if (x.type === 'array'){
            this.toggleExpansion(x.value,expand);
          }
      })
      }
    })
  }

}
