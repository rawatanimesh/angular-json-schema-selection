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

  jsonList = [];

  constructor() { }

  ngOnInit(): void {
    // this.selectedOutputSchema.emit(this.jsonSchema);
    console.log('json list', this.jsonSchema);
    this.jsonToList(this.jsonList, this.jsonSchema);
    console.log('json list', this.jsonList);
  }

  updateAllComplete(){

  }

  jsonToList(list: Array<any>, json: any): void {
    for (const [key, value] of Object.entries(json)) {
      if (this.typeof(value) === 'object') {
        const newList: any = [];
        this.pushData(list, key, newList, 'object');
        this.jsonToList(newList, value);
      } else if (this.typeof(value) === 'array') {
        const newList: any = [];
        // @ts-ignore
        value.forEach((x, index) => {
          if (this.typeof(x) === 'object') {
            console.log('ddddddddddd', x);
            this.jsonToList(newList, x);
          } else {
            this.pushData(newList, index.toString(), x, this.typeof(x));
          }
        });
        this.pushData(list, key, newList, 'array');
      } else {
        this.pushData(list, key, value, 'flat');
      }
    }
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
    list.push({key, value, type, id: this.generateId()});
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
    console.log('pppppoooo>>>>', json);
  }

  listToJson(list: Array<any>, json: any): void {
    list.forEach(x => {
      if (!x.type || x.type === 'flat') {
        json[x.key] = x.value;
      } else if (x.type === 'object') {
        json[x.key] = {};
        this.listToJson(x.value, json[x.key]);
      } else if (x.type === 'array'){
        json[x.key] = x.value.map((y:any) => y.value);
      }
    });
  }

}
