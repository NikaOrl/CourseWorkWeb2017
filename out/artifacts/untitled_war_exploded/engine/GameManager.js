
var fs_global =null;

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }
    ;

    console.log('Error: ' + msg);
}
function onInitFs(fs) {
    fs_global = fs;
}

//80% inspired by metoda
var gameManager = { // менеджер игры
    factory: {}, // фабрика объектов на карте
    units: [], // объекты на карте
    hero: null, // указатель на объект игрока
    enemy: null,
    bonus: null,
    laterKill: [], // отложенное уничтожение объектов
    updateTimer:null,

    //100% metoda
    initHero: function (obj) { // инициализация игрока
        this.hero = obj;
    },

    //100% metoda
    initEnemy: function (obj) {
        this.enemy = obj;
    },

    initBonus: function (obj) {
        this.bonus = obj;
    },

    //100% metoda
    kill: function (obj) {
        this.laterKill.push(obj);
    },


    update: function () { // обновление информации

        //обновление информации по всем объектам на карте
        this.units.forEach( e => e.update(eventsManager, mapManager, this.hero));

        this.time++;
        // удаление всех объектов попавших в laterKill
        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.units.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.units.splice(idx, 1); // удаление из массива 1 объекта
        }
        if (this.laterKill.length > 0) // очистка массива laterKill
            this.laterKill.length = 0;
        mapManager.draw(ctx);

        //mapManager.centerAt(this.hero.pos_x, this.hero.pos_y);
        this.draw(ctx);

        if(this.units.length > 0){
            gameSettings.checkGameConditions(this.units);
        }


    },

    //100% metoda
    draw: function (ctx) {
        for (var e = 0; e < this.units.length; e++) {
            this.units[e].draw(ctx);
        }
    },

    //100% copied from metoda
    loadAll: function (mapName) {
        soundManager.init();
        soundManager.loadArray(['/music/st.mp3']);
        soundManager.play('/music/st.mp3', {looping: true, volume: 8});
        mapManager.loadMap(mapName); // загрузка карты
        spriteManager.loadAtlas("/json/atlas.json", "img/atlas/atlas.png"); // загрузка атласа
        spriteManager.init();
        gameManager.factory['hero'] = Hero; // инициализация фабрики
        gameManager.factory['enemy'] = Enemy;
        gameManager.factory['bonus'] = Bonus;
        mapManager.parseEntities(); // разбор сущностей карты
        mapManager.draw(ctx); // отобразить карту
        eventsManager.setup(); // настройка событий


        //get access to files on pc
        window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);
    },
    play: function (mapName) {
        gameManager.loadAll(mapName);
        this.updateTimer = setInterval(updateWorld, 100);
    },

    stop(){
        clearInterval(this.updateTimer);
    }
};
