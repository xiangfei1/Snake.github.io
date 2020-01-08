let body = document.body;
let foodArr = [];   //保存食物，进行后续食物的初始化操作
let snakeArr = [];  //保存小蛇，进行后续小蛇的初始化操作
// 随机产生坐标值
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
// 地图构造函数
function Map(width, height, color) {
    this.width = width || 500;
    this.height = height || 500;
    this.color = color || '#ccc';
}

// 地图初始化
Map.prototype.init = function (unbody) {
    let div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
    div.setAttribute('id', 'map');
    unbody.appendChild(div);
}

// 食物构造函数
function Food(width, height, color, x, y) {
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || 'green';
    this.x = x || 0;
    this.y = y || 0;
}

// 食物初始化
Food.prototype.init = function (unmap) {
    removeFood();
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
    this.x = parseInt(getRandom(0, unmap.offsetWidth / this.width)) * this.width;   //随机生成食物的横坐标
    this.y = parseInt(getRandom(0, unmap.offsetHeight / this.height)) * this.height;    //随机生成食物的纵坐标
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    foodArr.push(div);
    unmap.appendChild(div);
}

//删除食物
function removeFood() {
    for (let i = 0; i < foodArr.length; i++) {
        let ele = foodArr[i];
        ele.parentNode.removeChild(ele);        //找到父元素，并删除子元素本身
        foodArr.splice(i, 1);                   //同时删除数组中的值
    }
}

// 小蛇构造函数
function Snake(width, height, direction) {
    this.width = width || 20;
    this.height = height || 20;
    this.snakebody = [
        { x: 3, y: 1, color: 'red' }, //头部
        { x: 2, y: 1, color: 'brown' }, //身体
        { x: 1, y: 1, color: 'brown' }
    ];
    this.direction = direction || 'right';
}

// 小蛇初始化
Snake.prototype.init = function (unmap) {
    removeSnake();
    for (let i = 0; i < this.snakebody.length; i++) {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.backgroundColor = this.snakebody[i].color;
        div.style.left = this.snakebody[i].x * this.width + 'px';
        div.style.top = this.snakebody[i].y * this.height + 'px';
        snakeArr.push(div);
        unmap.appendChild(div);
    }
}

// 小蛇的移动
Snake.prototype.move = function (food,map) {
    let i = this.snakebody.length - 1;  //2
    // 小蛇身体的移动
    for (; i > 0; i--) {
        this.snakebody[i].x = this.snakebody[i - 1].x;
        this.snakebody[i].y = this.snakebody[i - 1].y;
    }
    // 小蛇头部的移动
    switch (this.direction) {
        case 'right': this.snakebody[0].x += 1; break;
        case 'left': this.snakebody[0].x -= 1; break;
        case 'top': this.snakebody[0].y -= 1; break;
        case 'bottom': this.snakebody[0].y += 1; break;
    }
    // 吃到食物
    // 小蛇头部坐标
    let x = this.snakebody[0].x * this.width;
    let y = this.snakebody[0].y * this.height;
    // 判断头部坐标与食物坐标是否相等
    if(x == food.x && y == food.y) {
        let last = this.snakebody[this.snakebody.length-1];
        this.snakebody.push({
            x: last.x,
            y: last.y,
            color: last.color
        });
        food.init(map);
    }
}

//删除小蛇
function removeSnake() {
    let i = snakeArr.length - 1;
    for (; i >= 0; i--) {
        let ele = snakeArr[i];
        ele.parentNode.removeChild(ele);    //找到父元素，并删除子元素本身
        snakeArr.splice(i, 1);               //同时删除数组中的值
    }
}

// 游戏对象的构造函数
function Game(mapt) {
    this.food = new Food();
    this.snake = new Snake();
    this._this = this;
    this.mapt = mapt;
}

// 游戏初始化
Game.prototype.init = function () {
    // 食物的初始化
    this.food.init(this.mapt);
    // 小蛇初始化
    this.snake.init(this.mapt);
    this.run();
    this.configure();
}

// 开始游戏
Game.prototype.run = function () {
    let timer = setInterval(function(){
        this.snake.move(this.food,this.mapt);
        this.snake.init(this.mapt);
        let maxX = this.mapt.offsetWidth;
        let maxY = this.mapt.offsetHeight;
        let headX = this.snake.snakebody[0].x * this.snake.width;
        let headY = this.snake.snakebody[0].y * this.snake.height;
        if(headX<0 || headX>=maxX) {
            clearInterval(timer);
            alert('游戏结束');
        }
        if(headY<0 || headY>=maxX) {
            clearInterval(timer);
            alert('游戏结束');
        }
    }.bind(this._this),150);
}
// 游戏设置
Game.prototype.configure = function(){
    window.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 37: this.snake.direction = 'left';break;
            case 38: this.snake.direction = 'top';break;
            case 39: this.snake.direction = 'right';break;
            case 40: this.snake.direction = 'bottom';break;
        }
    }.bind(this._this));
}

let map = new Map();
map.init(body);
let mapt = document.getElementById('map');
let gm = new Game(mapt);
gm.init();