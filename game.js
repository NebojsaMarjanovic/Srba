const cvs = document.getElementById("srba");   //pristupamo canvas elementu preko ID-a
const ctx = cvs.getContext("2d");              //getContext metoda vraca metode koje omogucavaju crtanje
let frejmovi=0; 

//dodavanje muzike koja ide u pozadini
const DIE=new Audio();
DIE.src="morava.mp3";

const PLAY=new Audio();
PLAY.src="uzicko.mp3";

const READY=new Audio();
READY.src="tikadjosa.mp3";

//ucitavamo sliku sa koje uzimamo elemente canvasa
const dizajn=new Image();      
dizajn.src="design.png";

//da bi se čuvali podaci o stanju igrice u kojem se nalazi igrač
const stanje={
    trenutno:0,
    priprema:0,
    igra:1,
    kraj:2
}

//start dugme
const startBtn = {
    x:120,
    y:263,
    w:83,
    h:29
}


//upravljanje igricom
cvs.addEventListener("click",function(evt){
    switch(stanje.trenutno){
        case stanje.priprema:
            stanje.trenutno = stanje.igra;
            break;
        case stanje.igra:
            if(srba.y-srba.radius<=0) return;
            srba.skok();
            break;
        case stanje.kraj:
            //prilikom skrolanja menja se pozicija kanvasa
            let rect= cvs.getBoundingClientRect();//pozicije i dimenzije kanvasa
            let clickX=evt.clientX-rect.left;
            let clickY = evt.clientY-rect.top;

            //PROVERA DA LI JE KLIKNUTO START
        if(clickX >= startBtn.x && clickX <=startBtn.x+startBtn.w && clickY>=startBtn.y && clickY <=startBtn.y + startBtn.h){
            stubovi.reset();
            srba.brzinaReset();
            rezultat.reset();
            stanje.trenutno=stanje.priprema;
        }
        break;        
    }
});


const pozadina={
    sX:0,       //sX i sY - koordinate na slici
    sY:0,
    w:275,      //sirina pozadine
    h:226,      //visina pozadine
    x:0,        //x i y - koordinate na canvasu
    y: cvs.height-226,

    nacrtaj:function(){
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        //da bismo produzili pozadinu do kraja canvasa
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    }
}


const zemlja={
    sX:276,
    sY:0,
    w:224,
    h:112,
    x:0,
    y:cvs.height-110,
    dx:2,

    nacrtaj:function(){
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
                //da bismo produzili zemlju do kraja canvasa
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    },
    azuriraj:function(){
        if(stanje.trenutno==stanje.igra){
            /*koordinata x ce se uvek smanjivati za 2 
            što će pomerati zemlju izvan canvasa sa leve strane
            sve dok koordinata x ne bude 0. Tada se ponavlja ovaj proces*/
            this.x=(this.x-this.dx)%(this.w/2);
        }
    }
}

const srba={
    animacija:[
         {sX:276, sY:114},
         {sX:276, sY:141},
         {sX:276, sY:166},
         {sX:276, sY:141},
 
     ],
     x:50,
     y:152,
     w:64,
     h:39,
 
     frejm:0,  

     //privlači Srbu ka zemlji tako što povećava vrednost y koordinate
     gravitacija:0.25,  
     //koristi se u metodi skok
     skakanje:4.6,
     //određuje poziciju tokom skoka/pada
     brzina:0, 
     radius:12,
     
     nacrtaj:function(){
         let srba=this.animacija[this.frejm];

         ctx.drawImage(dizajn,srba.sX,srba.sY,this.w,this.h,this.x-this.w/2,this.y-this.h/2,this.w,this.h);
     },

     skok:function(){
        this.brzina=-this.skakanje;  
    },

    azuriraj:function(){
        if(stanje.trenutno==stanje.priprema){
            //zaustavljanje muzike tokom stanja kraja igre
            DIE.pause();
            DIE.currentTime=0;
            //pustanje muzike za stanje pripreme
            READY.play();
            //reset pozicije nakon kraja igre
            this.y=150;     
        }else if(stanje.trenutno==stanje.igra){
            //zaustavljanje muzike tokom stanja pripreme
            READY.pause();
            READY.currentTime=0;
            //ptica pada ukoliko nema klika
            this.brzina+=this.gravitacija;
            this.y+=this.brzina;
            //pustanje muzike za stanje igre
            PLAY.play();
            //slucaj kada ptica dodirne zemlju - kraj
            if(this.y+this.h/2 >= cvs.height-zemlja.h){
                this.y = cvs.height - zemlja.h - this.h/2;
                stanje.trenutno = stanje.kraj;
             } 
        } else if(stanje.trenutno==stanje.kraj){
            //zaustavljanje muzike tokom stanja igre
            PLAY.pause();
            PLAY.currentTime=0;
            //pustanje muzike za stanje kraja igre
            DIE.play();          
        }

    },
    brzinaReset:function(){
        this.brzina=0;
    }

 }
 
 const pripremiSe={
    sX:0,
    sY:235,
    w:200,
    h:152,
    x:cvs.width/2-170/2,
    y:120,

    nacrtaj: function(){
        if(stanje.trenutno==stanje.priprema){
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    },
}

const krajIgre={
    sX:248,
    sY:235,
    w:255,
    h:212,
    x:cvs.width/2-255/2,
    y:96,

    nacrtaj: function(){
        if(stanje.trenutno==stanje.kraj){
        ctx.drawImage(dizajn,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

const stubovi = {
    pozicija : [],  //za čuvanje pozicije stubova
    gore : {
        sX : 553,
        sY : 0
    },
    dole:{
        sX : 502,
        sY : 0
    },
    w : 53,
    h : 400,
    razmak : 85,
    maxYpoz : -150, //najveca visina na kojoj može da se nalazi stub
    dx : 2, //pomeraj
    
    nacrtaj : function(){
        for(let i  = 0; i < this.pozicija.length; i++){
            let p = this.pozicija[i];
    
            let goreYpoz = p.y;
            let doleYpoz = p.y + this.h + this.razmak;
            
            // gornji stub
            ctx.drawImage(dizajn, this.gore.sX, this.gore.sY, this.w, this.h, p.x, goreYpoz, this.w, this.h);  
            
            // doljni stub
            ctx.drawImage(dizajn, this.dole.sX, this.dole.sY, this.w, this.h, p.x, doleYpoz, this.w, this.h);  
        }
    },
    
    azuriraj: function(){
        if(stanje.trenutno !== stanje.igra) return;
        
        //na svakih 100 frejmova dodajemo novi stub
        if(frejmovi%100 == 0){
            this.pozicija.push({
                x : cvs.width,
                y : this.maxYpoz * ( Math.random() + 1)
            });
        }

        for(let i = 0; i < this.pozicija.length; i++){
            let p = this.pozicija[i];
            
            let donjiStubYPoz = p.y + this.h + this.razmak;
            
           // DETEKCIJA KONTAKTA SA STUBOM
            // gornji stub
            if(srba.x + srba.radius > p.x && srba.x - srba.radius < p.x + this.w && srba.y + srba.radius > p.y 
                && srba.y - srba.radius < p.y + this.h){
                stanje.trenutno = stanje.kraj;
                    DIE.play();
                    PLAY.pause();
                    PLAY.currentTime=0;
            }
            // donji stub
            if(srba.x + srba.radius > p.x && srba.x - srba.radius < p.x + this.w && srba.y + srba.radius > donjiStubYPoz 
                && srba.y - srba.radius < donjiStubYPoz + this.h){
                stanje.trenutno = stanje.kraj;
                DIE.play();
                PLAY.pause();
                PLAY.currentTime=0;
            }
            // pomeranje stubova ulevo
            p.x -= this.dx;
            // kada stub ode iza kanvasa brišemo ga iz niza
            if(p.x + this.w <= 0){
                this.pozicija.shift();
               rezultat.vrednost+=1;

               rezultat.najbolji=Math.max(rezultat.vrednost, rezultat.najbolji);
               localStorage.setItem("najbolji", rezultat.najbolji);
            }
        }
    },
    //za pražnjenje niza na kraju igre
    reset : function(){
        this.pozicija = [];
    }
}


const rezultat={
    //čuva najbolji rezultat
    najbolji: parseInt(localStorage.getItem("najbolji")) || 0,  
    vrednost: 0,

    nacrtaj:function(){
        ctx.fillStyle="#FFF";
        ctx.strokeStyle = "#000";

        if(stanje.trenutno == stanje.igra){
            ctx.lineWidth=2;
            ctx.font = "35px Teko";
            ctx.fillText(this.vrednost, cvs.width/2, 50);
            ctx.strokeText(this.vrednost, cvs.width/2, 50);

       }else if(stanje.trenutno == stanje.kraj){
           //REZULTAT
            ctx.font = "35px Teko";
             ctx.fillText(this.vrednost, 90, 200);
            ctx.strokeText(this.vrednost, 90, 200);
            //NAJBOLJI REZULTAT
            ctx.fillText(this.najbolji, 210, 200);
            ctx.strokeText(this.najbolji, 210, 200);
        }
    },
    //reset rezultata na kraju igre
    reset:function(){
        this.vrednost=0;
    }
}





//u funkciji nacrtaj pozivamo sve funkcije za crtanje elemenata
function nacrtaj(){                               
    ctx.fillStyle="black";                      
    ctx.fillRect(0,0,cvs.width,cvs.height);
    pozadina.nacrtaj();
    stubovi.nacrtaj();
    zemlja.nacrtaj();
    srba.nacrtaj();
    pripremiSe.nacrtaj();
    krajIgre.nacrtaj();
    rezultat.nacrtaj();
}

//za azuriranje pozicije elemenata u canvasu
function azuriraj(){
    srba.azuriraj();
    zemlja.azuriraj();
    stubovi.azuriraj();
}

//sluzi da bi se igrica u svakoj sekundi azurirala
function loop(){
    azuriraj();
    nacrtaj();
    frejmovi++;                     
    requestAnimationFrame(loop); //metoda kojom zahtevamo od pretrazivaca da pozove specificnu fju da bi azurirala canvas 
}
loop();



