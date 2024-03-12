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
  name: string ="";
  plano : any[] = [];
  private cx: CanvasRenderingContext2D | undefined;

  constructor(private blueprint: BlueprintsService){}
  ngAfterViewInit(): void {
    this.render();
  }
  ngOnInit(): void {
  }

  obternerBlueprints(){
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

  getBlueprint(){
    this.blueprint.getBlueprint(this.author,this.name).subscribe((response) =>{
      this.drawBlueprint(response.points);
      this.name = response.name;

    },
    (error)=>{
      alert("Ese autor no tiene relacionado ningun plano");
    }
    );
  }

  drawBlueprint(points:any[]){
    
  }

  private render():any{
    const lienzo = this.canvasRef.nativeElement;
    this.cx = lienzo.getContext('2d');
  }
}
