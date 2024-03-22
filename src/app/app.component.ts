  import { AfterViewInit, Component, OnInit , ElementRef, ViewChild} from '@angular/core';
  import { BlueprintsService } from './service/blueprints.service';
  import { points } from "./points";
  import { blueprintJson } from './blueprintJson';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  export class AppComponent implements OnInit, AfterViewInit{
    @ViewChild('canvasRef', { static: false }) canvasRef: any;

    author: string = "";
    title = 'front-Blueprints';
    blueprintsList : blueprintJson[] = [];
    newBlueprint:  blueprintJson | undefined;
    totalPoints: number =0;
    nameSubtitle: string ="";
    plano : points[] = [];
    nuevo: boolean = false;
    private cx: CanvasRenderingContext2D | undefined;

    constructor(private blueprint: BlueprintsService){}
    ngAfterViewInit(): void {
      this.render();
    }
    ngOnInit(): void {  
    }

  obternerBlueprints(){ 
    this.totalPoints=0;
    this.blueprint.getBlueprintsByAuthor(this.author).subscribe((response) =>{
      this.blueprintsList = response;
      console.log(this.blueprintsList[0].points);
      for(let i = 0; i< this.blueprintsList.length ;i++){
        this.totalPoints += this.blueprintsList[i].points.length;
      }
    },
    (error)=>{
      alert("Ese autor no tiene relacionado ningun plano");
    }
    );
  }

  getBlueprint( name: string) {
    this.blueprint.getBlueprintsByNameAndAuthor (this.author, name).subscribe(
      (response) => {
        this.plano = response.points;
        this.drawBlueprint();
        this.nameSubtitle=name;
      },
      (error) => {
        alert("Ese autor no tiene relacionado ningun plano");
      }
    );
  }

  drawBlueprint(): void {
    if (!this.cx) return; // Verificar si el contexto del lienzo existe
  
    this.cx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height); // Limpiar el lienzo antes de dibujar
  
    this.cx.beginPath();
    this.cx.strokeStyle = 'black'; // Color del trazo
    this.cx.lineWidth = 7; // Grosor del trazo
    for (let i = 0; i < this.plano.length; i++) {
      const point = this.plano[i];
      if (i === 0) {
        this.cx.moveTo(point.x, point.y); // Mover el lápiz al primer punto
      } else {
        this.cx.lineTo(point.x, point.y); // Dibujar una línea desde el punto anterior al actual
      }
    }
  
    this.cx.stroke(); // Dibujar el trazo
  }

  private render():any{
    const lienzo = this.canvasRef.nativeElement;
    this.cx = lienzo.getContext('2d');
  }

  onClick(event: MouseEvent){
    const target = event.target as HTMLElement;
    if (target && this.nameSubtitle!= "") {
      const rect = target.getBoundingClientRect();
      let newPosition :points = {"x" :Math.floor(event.clientX - rect.left),"y": Math.floor(event.clientY - rect.top)};
      this.plano.push(newPosition);
      console.log(this.plano);
      this.drawBlueprint();
    }
  }

  updateOrSaveBlueprint(confirm : boolean){
    this.nuevo = confirm;
    
    if(this.nuevo){
      const respuesta = prompt("Por favor, ingrese el nombre del nuevo plano:");
      if(respuesta != null){
        this.newBlueprint  = {"author" : this.author, "name": respuesta,"points" : []};
        this.nameSubtitle=respuesta;
        this.blueprint.addNewBlueprint(this.newBlueprint).subscribe((res)=>{
          this.obternerBlueprints();
          this.clearCanvas();
        });
      }
    }else{
      this.newBlueprint  = {"author" : this.author, "name": this.nameSubtitle,"points" : this.plano};
      this.blueprint.saveOrUpdateBlueprint(this.newBlueprint).subscribe((res)=>{
        this.obternerBlueprints();
        this.clearCanvas();
      });
    }
    
  }

  clearCanvas() {
    if (!this.cx) return; // Verificar si el contexto del lienzo existe
    const canvas = this.canvasRef.nativeElement;
    this.cx.clearRect(0, 0, canvas.width, canvas.height); // Borrar todo el lienzo
  }

  deleteBlueprint(){
    this.newBlueprint  = {"author" : this.author, "name": this.nameSubtitle,"points" : this.plano};
    this.blueprint.deleteBlueprint(this.newBlueprint).subscribe((res)=>{
      this.obternerBlueprints();
      this.clearCanvas();
    })
  }
}
