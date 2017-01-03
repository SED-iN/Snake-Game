var scl = 30;
var food;
var fr = 8; 
var deathcount = 0;
var highscore = localStorage.getItem("highscore");


var old_touchX, old_touchY;


function setup() {
  
  var canvas = createCanvas(540,540);
  canvas.parent('snake');
  s = new Snake;
  f = new Food;
  frameRate(fr);
  pickLocation();

}

function draw() {
  background(51);
  s.show();
 
  s.update();
  s.death();

  if (highscore === null) {
  highscore = 0;
  
  }
  
  push();
  textSize(20);
  fill(0, 245, 255);
  text('Deathcount : ' + deathcount, 370, 30);
  pop();

  push();
  textSize(20);
  fill(0, 245, 255);
  text('Highscore : ' + highscore, 10, 30);
  pop();

  push();
  textSize(20);
  fill(0, 245, 255);
  text('Score : ' + s.score, 220, 30);
  pop();

  if (s.eat(food)) {
    fr = fr * 1.01;
    frameRate(fr);
    pickLocation();
  }

  f.show();
  pop();

}


function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);
  var rcol = random(cols);
  var rrow = random(rows);
   
   
             food = createVector(floor(rcol), floor(rrow));
             food.mult(scl);
             
   for (var i = 0; i < s.tail.length; i++) {
       var pos = s.tail[i];
       var d = dist(food.x, food.y, pos.x, pos.y);
         if (d < 1) {
             console.log("merde");
             pickLocation();
          } 
     
  }
}


function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  this.color = ['chartreuse', 'white', 'gold', 'cornflowerblue', 'palevioletred', 'tomato', 'silver', 'sandybrown', 'yellowgreen', 'black'];
  this.score = 0;
  
  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score = this.total * 10;
      if (this.score > highscore) {
       highscore = this.score; 
	   localStorage.setItem("highscore", this.score);
      }
      return true;
    } else {
      return false;
    }
 }
  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }
    this.death = function() {
      for (var i = 0; i < this.tail.length; i++) {
        var pos = this.tail[i];
        var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        console.log('GAME OVER');
        this.total = 0;
        this.tail = [];
        this.x = width/2 - scl;
        this.y = height/2 - scl;
        pickLocation();
        var tempscore = this.score;
        if (tempscore > highscore) {
         highscore = tempscore; 
		 localStorage.setItem("highscore", tempscore);
        }
        this.score = 0;
        deathcount++;
        fr = 8;
        frameRate(fr);
      }
    }
  }
 
  this.update = function() {
      if (this.total === this.tail.length) {
        for (var i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y); 
     
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
    
  //  console.log(this.x);
    
  }
 
    this.show = function() {
      for (var i = 0; i < this.tail.length; i++) {
        
        var index = floor((this.score % 500) / 50);
        fill(this.color[index]);
        rect(this.tail[i].x, this.tail[i].y, scl, scl);
        

    }
    var index = floor((this.score % 500) / 50);
    fill(this.color[index]);
    rect(this.x, this.y, scl, scl); 
    
 //  noStroke();
  }

  
}

function Food() {
 this.show = function() {
  fill(255, 0, 0);
  rect(food.x, food.y, scl, scl); 
 }
  
}

function touchStarted() {
    //console.log("started - > " + floor(touchX) + "," + floor(touchY));
    old_touchX = touchX;
    old_touchY = touchY;
    return false;
}

function touchMoved() {
    //to avoid browsers scroll  or drag behaviour
    return false;
}

function touchEnded() {
    // console.log(floor(touchX) + "," + floor(touchY));
    var x_diff = touchX - old_touchX;
    var y_diff = touchY - old_touchY;

    if (s.xspeed == 0) { //snake going up or down
        //console.log(x_diff);
        if (x_diff > 40)
            s.dir(1, 0);
        else if (x_diff < -40)
            s.dir(-1, 0);
    } else if (s.yspeed == 0) { //snake going left or right
        //console.log(y_diff);
        if (y_diff > 40)
            s.dir(0, 1);
        else if (y_diff < -40)
            s.dir(0, -1);
    }
    return false;
}


function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (s.yspeed === 1 && s.tail.length > 0) {
    } else {
    s.dir(0, -1);  
    }
  } else if (keyCode === DOWN_ARROW) {
    if (s.yspeed === -1 && s.tail.length > 0) {
    } else {
    s.dir(0, 1);
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (s.xspeed === -1 && s.tail.length > 0) {
    } else {
    s.dir(1, 0);
    }
  } else if (keyCode === LEFT_ARROW) {
    if (s.xspeed === 1 && s.tail.length > 0) {
    } else {
    s.dir(-1, 0);
    }
  }
}
