<!DOCTYPE HTML>
<html>

<head>
   <style type = "text/css">
      canvas { border: 1px dotted black}
   </style>
</head>

   <body>
    <h3>GORILLAS TOSSING GORILLAS AT GORILLAS</h3>
    <canvas id="gameScreen" width="800" height="400" >sorry your browser sucks</canvas>
    <button id="play" onclick="makeGame()" type="button">play game</button>
    
    <form id ="shotInput">
        Angle: <input type="hidden">
        Power: <input type="hidden">
        <input id="fireB" type="hidden" onclick="taketurn(this.form)" value="FIRE">
    </form>
    <div id="gameInfo"></div>
    <script>
  
        var game_screen = document.getElementById("gameScreen");
        var context = game_screen.getContext("2d");
        var gorilla1 = new gorilla(100,200);   
        var gorilla2 = new gorilla(700,200);
        
        function drawGorilla(){
                // gorilla legs
            context.fillStyle = "brown";
            context.beginPath();
            context.arc(95, 85, 10, 2* Math.PI,0);
            context.closePath();
            context.fill();


            context.fillStyle = "white";
            context.beginPath();
            context.arc(95, 85, 4, 2* Math.PI,0);
            context.closePath();
            context.fill();
            //leg cut off
            context.fillRect(77,88,30,10);
            // body
            context.fillStyle = "brown";
            context.fillRect(90,66,10,14);

            context.beginPath();
            context.arc(95,66,9, Math.PI, 2 * Math.PI, true);
            context.closePath();
            context.fill();
            // head
            context.fillRect();
        }
        
        function toRad(degrees){
            this.degrees = degrees;
            return (this.degrees/180)*Math.PI;
        }
        
        function gorilla(xpos,ypos,color){
            this.color = color;
            this.gHeight = 20;
            this.gWidth = 20;
            this.xpos = xpos;
            this.ypos = ypos;
            this.hitBox = [];
            gorilla.prototype.toss = function(){};
        
            
            gorilla.prototype.place = function(){
                context.fillRect(this.xpos,this.ypos,this.gWidth,this.gHeight);
                for(var column = this.xpos; column <= this.xpos+this.gWidth; column++){
                    console.log("first for loop is triggering");
                    for(var row =this.ypos; row <= this.ypos + this.gHeight; row++){
                        console.log("both for loops are triggering");
                        this.hitBox[this.hitBox.length] =[column,row];
                    }
                }
                console.log(this.hitBox);
                console.log(this.hitBox.length);
            };
        }
        
        function aMissile(angle,power){
            this.angle = toRad(angle);
            this.power = power;
          
            this.xpos = gorilla1.xpos;
            this.ypos = gorilla1.ypos;
            this.trajectory = [[this.xpos,this.ypos]];
            
            this.yVector = 0 - (Math.sin(this.angle)*this.power);
            this.xVector = Math.cos(this.angle)*this.power;
            
            this.hitMonkey = false;
            console.log(this.hitMonkey);
            
            aMissile.prototype.calcTraj =function(){
                var gravity = 2;
                while(this.ypos < 400){
                    context.fillRect(this.xpos,this.ypos,5,5);
                    this.xpos = Math.floor(this.xpos + this.xVector);
                    this.ypos = Math.floor(this.ypos + this.yVector);
                    this.trajectory[this.trajectory.length] = [this.xpos,this.ypos];
                    this.yVector = this.yVector + gravity;
                    gravity += gravity;
                }
            };
            
            aMissile.prototype.isHit = function(gorilla){
            //builds a path out of the trajectory points and then returns true. if any hitBox points are in path. 
                console.log("is hit function triggered");
                console.log(gorilla);
                console.log("the trajectory is " + this.trajectory);
                context.beginPath();
                context.moveTo(this.trajectory[1][0],this.trajectory[1][1]);
                console.log('it is the forloops');
                
                for(var i = 1; i < this.trajectory.length; i++ ){
                    context.lineTo(this.trajectory[i][0],this.trajectory[i][1]);
                    console.log("1for loop iteratings");
                }
                context.stroke();
                
                console.log(gorilla.hitBox);
                console.log("the hitbox length is ");
                console.log(gorilla.hitBox.length);
                console.log("x coord " + gorilla.hitBox[0][0]);
                console.log( "y coord " + gorilla.hitBox[0][1]);
                
                for(var col = 0 ; col < gorilla.hitBox.length; col++){
                    console.log("hitchecker is iterating");
                    if(context.isPointInPath(gorilla.hitBox[col][0],gorilla.hitBox[col][1])){
                        this.hitMonkey = true;
                        console.log("the if is triggered");
                        this.explode(gorilla.hitBox[col][0],gorilla.hitBox[col][1]);
                        break;
                    }   
                }
                context.closePath();
                console.log("should have a trajectory here:");
                console.log(this.trajectory);
                console.log("shot was a  hit = " + this.hitMonkey);
            };
            
            aMissile.prototype.shoot  = function(){                
                    console.log("shoot loop is exectuting");
                    console.log(this.hitMonkey);
                    this.calcTraj();
                    this.isHit(gorilla1);
                    this.isHit(gorilla2);
                   
                    //window.setTimeout(function(){for(var i = 0; i<1000; i++){}},2000);
                console.log("loop completed");
            };
            
            aMissile.prototype.explode = function(x,y){
                context.beginPath();
                context.strokestyle = 'red';
                context.arc(x,y,4, 2*Math.PI, 0);
                context.closePath();
                context.fill();
            };
        }
        
        function building(width,height,color){
            this.width = width;
            this.height = height;
            this.color = color;
            building.prototype.draw = function(){};
        }
 
        var wind = {
            strength : 10*(Math.floor(Math.random()) + 1),
            direction :2 *(Math.floor(Math.random()) + 1)
            };
            
        var skyline = {
            color : "brown",
            height : 221,
            start : 0,
            end : 800
        };
        
        function taketurn(form){
            //set up html on form
            //alert("take turn is executing");
            this.angle = Number(form[0].value);
            this.power = Number(form[1].value);
            var missile = new aMissile(this.angle,this.power);
            //alert(missile.yVector);
            missile.shoot();
            if(missile.hitMonkey){
                cleanUp();
            }
        }
        
        function cleanUp(){
            alert("game over");
            context.clearRect(0,0,800,400);
            document.getElementById("fireB").type = "hidden";
            document.getElementById("shotInput")[0].type = "hidden";
            document.getElementById("shotInput")[1].type = "hidden";
    
            document.getElementById("shotInput")[0].value = null;
            document.getElementById("shotInput")[1].value = null;
        }
        
        function makeGame(){
            
            //I think i don't actually need a main function like in c which is weird
            // i don't know how to do a game state thing
                  // skyline
            // place gorillas
            //alert("set up is exectuting");
            gorilla1.place();
            gorilla2.place();
            // set wind
           var game = {};
           game.windStrength = wind.strength;
           game.windDirection = wind.diretion;
           game.skyline = skyline;
           context.beginPath();
           context.strokeStyle = game.skyline.color;
           context.moveTo(game.skyline.start,game.skyline.height);
           context.lineTo(game.skyline.end,game.skyline.height);
           context.stroke();
           context.closePath();
           
           document.getElementById("fireB").type = "button";
           document.getElementById("shotInput")[0].type = "text";
           document.getElementById("shotInput")[1].type = "text";
        }
        
      </script>
   </body>
</html>
