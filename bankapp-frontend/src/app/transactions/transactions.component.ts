import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable'
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
   transaction:any=[]
   searchTerm:string=''
   constructor(private api:ApiService,private TransRouter:Router){}

    ngOnInit(): void {
      if(!localStorage.getItem('token')){
         alert('Please Login')
         this.TransRouter.navigateByUrl('')
        }
       this.api.getTransactionHistory().subscribe((result:any)=>{
        console.log(result);
        this.transaction=result.transaction
       },
       (result:any)=>{
        console.log(result.error.message);
        
       }
       )

    }
    //generate pdf
    generatePDF(){
      //step 1:create an object for jspdf
      var pdf=new jspdf

      //step 2:setup title row for the table
      let thead=['Type','From Account','To Account','Amount']

      let tbody=[]
      // step 3:setup pdf properties
      pdf.setFontSize(16)
      pdf.text('Mini Statements',15,10)
      pdf.setFontSize(12)
      pdf.setTextColor(99)

      //step 4:To display  as table ,need to convert array of object to Nested array
      for(let item of this.transaction){
         // temp =temporary array
         let temp=[item.type,item.fromAcno,item.toAcno,item.amount]//array
         tbody.push(temp)//nested array
      }
      
      //step 5:convert nested array to table using jspdf-autotable
      (pdf as any).autoTable(thead,tbody,{startY:15})

      //step 6:To open pdf in new tab 
      pdf.output('dataurlnewwindow')

      //step 7:To download as pdf file
      pdf.save('Transaction History.pdf')

    }
    logout(){
      localStorage.clear()
       this.TransRouter.navigateByUrl('')
     }
   
}
