var UnitConstants = {
    IDLE_STATE: 1,
    MOVING_STATE: 2,
    KILLED_STATE: 3,
    SHOOTING_STATE: 4,


    TOP_DIRECTION: "top",
    BOTTOM_DIRECTION: "bottom",
    RIGHT_DIRECTION: "right",
    LEFT_DIRECTION: "left"
};


//100% copied from metoda
var Unit = {
    pos_x: 0,  //current middle
    pos_y: 0,
    size_x: 0, //size
    size_y: 0,
    direction: UnitConstants.TOP_DIRECTION, //where it looking
    speed: 1, //pixels per tic
    state: UnitConstants.IDLE_STATE,

    //100% from metoda
    fire: function () {

        let rocket = Object.create(Rocket);
        rocket.name = 'rocket' + (++gameManager.fireNum);
        rocket.pos_x = this.pos_x;
        rocket.pos_y = this.pos_y;
        rocket.direction = this.direction;
        switch (this.direction) {
            case UnitConstants.LEFT_DIRECTION: // выстрел влево
                rocket.pos_x = this.pos_x - 40;
                break;
            case UnitConstants.RIGHT_DIRECTION: // выстре вправо
                rocket.pos_x = this.pos_x + 40;
                break;
            case UnitConstants.TOP_DIRECTION: // выстрел вверх
                rocket.pos_y = this.pos_y - 40;
                break;
            case UnitConstants.BOTTOM_DIRECTION: // выстрел вниз
                rocket.pos_y = this.pos_y + 40;
                break;
        }
        gameManager.units.push(rocket);
    },

    extend: function (extendProto) { // расширение сущности
        var object = Object.create(this); // создание нового объекта
        for (var property in extendProto) { // для всех свойств нового объекта
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                // если свойства отсутствуют в родительском объекте, то добавляем
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};

var Bonus = Unit.extend({
    name: "bonus",
    type:"bonus",
    speed: 0,
    draw: function (ctx) {// прорисовка объекта
        spriteManager.drawSprite(ctx, this.type, null, this.pos_x, this.pos_y);
    },
    update: function () {
        physicManager.update(this);

    },

    //100% from metoda
    onTouchEntity: function (obj) {
        if(obj.name === "hero")
            this.kill();
    },

    //100% from metoda
    kill: function () {
        gameManager.kill(this);
    },


});

var Rocket = Unit.extend({
    speed:20,
    tile_size:32,
    type:"rocket",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "rocket", null, this.pos_x, this.pos_y,);
    },
    update: function () {
        if (this.direction === UnitConstants.RIGHT_DIRECTION && (mapManager.getTilesetIdx(this.pos_x + 16, this.pos_y) !== 4 )) {
            this.pos_x += this.speed;
        }
        else
            {
            if (this.direction === UnitConstants.LEFT_DIRECTION && (mapManager.getTilesetIdx(this.pos_x - 16, this.pos_y) !== 4)) {
                this.pos_x -= this.speed;
            }
            else {
                if (this.direction === UnitConstants.TOP_DIRECTION && (mapManager.getTilesetIdx(this.pos_x, this.pos_y - 16) !== 4)) {
                    this.pos_y -= this.speed;
                }
                else {
                    if (this.direction === UnitConstants.BOTTOM_DIRECTION && (mapManager.getTilesetIdx(this.pos_x, this.pos_y + 16) !== 4)) {
                        this.pos_y += this.speed;
                    }
                    else
                        this.kill();
                }
            }
        }

        physicManager.update(this);
    },
    onTouchEntity: function (objectOnAWay) {
        this.kill();
        if(objectOnAWay.type !== "bonus")
            objectOnAWay.kill();

    },
    onTouchMap: function (idx) {
        this.kill();
    },

    kill: function () {
        gameManager.kill(this);
    }

});


//80% inspired by metoda
var Hero = Unit.extend({
    name: "hero",
    type:"hero",
    speed: 3,
    draw: function (ctx) {// прорисовка объекта
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y);
    },
    update: function (eventsManager, mapManager, hero) {


        if (eventsManager.action["fire"]) {
            console.log("fire");
            this.fire();
        }
        if (eventsManager.action["up"] && (mapManager.getTilesetIdx(this.pos_x, this.pos_y - 16) !== 4)) {
            this.pos_y = this.pos_y + (-1 * this.speed);
            this.direction = UnitConstants.TOP_DIRECTION;
        }
        if (eventsManager.action["down"] && (mapManager.getTilesetIdx(this.pos_x, this.pos_y + 16) !== 4)) {
            this.pos_y = this.pos_y + (+1 * this.speed);
            this.direction = UnitConstants.BOTTOM_DIRECTION;
        }


        if (eventsManager.action["left"] && (mapManager.getTilesetIdx(this.pos_x - 16, this.pos_y) !== 4)) {
            this.pos_x = this.pos_x + (-1 * this.speed);
            this.direction = UnitConstants.LEFT_DIRECTION;
        }
        if (eventsManager.action["right"] && (mapManager.getTilesetIdx(this.pos_x + 16, this.pos_y) !== 4)) {
            this.pos_x = this.pos_x + (+1 * this.speed);
            this.direction = UnitConstants.RIGHT_DIRECTION;
        }
         physicManager.update(this);

    },

    //100% from metoda
    onTouchEntity: function (obj) {
    },

    //100% from metoda
    kill: function () {
        gameManager.kill(this);
    },


});

var Enemy = Unit.extend({
    name: "enemy",
    type:"enemy",
    route: [],
    lastFire:10,
    draw: function (ctx) {
        // прорисовка объекта
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y);
    },
    update: function (eventsManager, mapManager, hero) {
        physicManager.update(this);

        let aiManager = new AIManager(mapManager.xCount,//let-js6
            mapManager.yCount,
            mapManager.tSize.x);

        let doIt = aiManager.directEnemy(this, hero);//directEnemy- reshaet shto budet delet tanchik

        if (doIt === AIAction.ATTACK) {
            this.state = UnitConstants.SHOOTING_STATE;
            if(this.lastFire%10 ==0){
                this.fire();
            }
            this.lastFire=this.lastFire+1;
            return;
        }

        if (doIt.type === AIAction.WANDER_THE_MAP_TYPE ) {
            this.route = doIt.route;
            this.state = UnitConstants.MOVING_STATE;
        }

        if(doIt.type === AIAction.GO_CLOSER_TO_HERO_TYPE){
            this.route = doIt.route;
            this.state = UnitConstants.MOVING_STATE;
        }

        if (this.state = UnitConstants.MOVING_STATE) {
            if (this.route.length === 0) {
                this.state = UnitConstants.IDLE_STATE;
                return;
            }

            let nodeToPosX = x => x * mapManager.tSize.x + Math.floor(mapManager.tSize.x / 2);
            let nodeToPosY = y => y * mapManager.tSize.y + Math.floor(mapManager.tSize.y / 2);//perevodiat kvadrati v pikseli

            //proveriam doshli li mi do kvadratika ....
            if (nodeToPosX(this.route[0].x) === this.pos_x
                && nodeToPosY(this.route[0].y) === this.pos_y) {
                this.route.shift();
                return;
            }

            let x_direction = Math.sign(nodeToPosX(this.route[0].x) - this.pos_x);
            let y_direction = Math.sign(nodeToPosY(this.route[0].y) - this.pos_y);

            if (x_direction === 1 && y_direction === 0) {
                this.direction = UnitConstants.RIGHT_DIRECTION;
            }
            if (x_direction === -1 && y_direction === 0) {
                this.direction = UnitConstants.LEFT_DIRECTION;
            }
            if (x_direction === 0 && y_direction === 1) {
                this.direction = UnitConstants.BOTTOM_DIRECTION;
            }
            if (x_direction === 0 && y_direction === -1) {
                this.direction = UnitConstants.TOP_DIRECTION;
            }


            if (x_direction != 0 && y_direction != 0) {
                if (x_direction === 1) {
                    this.direction = UnitConstants.RIGHT_DIRECTION;
                }
                if (x_direction === -1) {
                    this.direction = UnitConstants.LEFT_DIRECTION;
                }
                this.pos_x += x_direction * this.speed;
            } else {
                this.pos_x += x_direction * this.speed;
                this.pos_y += y_direction * this.speed;
            }

        }

    },
    onTouchEntity: function (obj) {
        if(obj.name === "hero")
            obj.kill();
    },
    kill: function () {
        this.pos_y = 500 - this.pos_y;
        this.pos_x = 500 - this.pos_x;
    },
});
