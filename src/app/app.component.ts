  import { AfterViewInit, Component, OnInit , ElementRef, ViewChild} from '@angular/core';
  import { BlueprintsService } from './service/blueprints.service';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  export class AppComponent implements OnInit, AfterViewInit{
    @ViewChild('canvasRef', { static: false }) canvasRef: any;

    author: string = "";
    title = 'front-Blueprints';
    blueprintsList : any[] = [];
    totalPoints: number =0;
    nameSubtitle: string ="";
    plano : any[] = [];
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
      for(let point of this.blueprintsList){
        this.totalPoints += point.points.length;
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
        this.drawBlueprint(response.points);
        this.nameSubtitle=name;
      },
      (error) => {
        alert("Ese autor no tiene relacionado ningun plano");
      }
    );
  }

  drawBlueprint(points: any[]): void {
    if (!this.cx) return; // Verificar si el contexto del lienzo existe
  
    this.cx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height); // Limpiar el lienzo antes de dibujar
  
    this.cx.beginPath();
    this.cx.strokeStyle = 'black'; // Color del trazo
    this.cx.lineWidth = 7; // Grosor del trazo
  
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
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
}
