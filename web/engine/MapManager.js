//с 28 методы
// from metoda 80%
var mapManager = {
    mapData: null, //переменная для хранения карты from metoda
    tLayer: null, //переменная для хранения ссылки на блоки карты from metoda
    xCount: null, //количество  блоков по горизонтали from metoda
    yCount: null, //кол-во блоков по вертикали from metoda
    imgLoadCount: 0, // количество загруженных изображений
    imgLoaded: false, // изображения не загружены
    jsonLoaded: false, // json не загружен
    tSize: {x: null, y: null}, //размер блока from metoda
    mapSize: {x: null, y: null}, //размер карты в пикселях from metoda
    tilesets: [], //массив описаний блоков карты from metoda
    view: {x: 0, y: 0, w: 700, h: 700},
    // ajax-загрузка карты - from metoda 100%
    loadMap: function (path) {//в ф-цию отправляется путь к файлу, кот. необходимо загрузить
        var request = new XMLHttpRequest(); //создание запроса
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) { //получен корректный ответ и можно обрабатывать
                mapManager.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        //true - отправить запрос на  path с использованием функции GET
        request.send(); //отправка запроса
    },


    //method copied from metoda 100%
    parseMap: function (tilesJSON) {
        this.mapData = JSON.parse(tilesJSON); //разобрать JSON
        this.xCount = this.mapData.width; // соэранение ширины
        this.yCount = this.mapData.height; // сохранение высоты
        this.tSize.x = this.mapData.tilewidth; // сохранение размера блока
        this.tSize.y = this.mapData.tileheight; // сохранение размера блока
        this.mapSize.x = this.xCount * this.tSize.x; // вычисление размера карты
        this.mapSize.y = this.yCount * this.tSize.y;
        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image(); // создаем переменную для хранения изображений
            img.onload = function () { // при загрузке изображения
                mapManager.imgLoadCount++;
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true; // загружены все изображения
                }
            };
            img.src = this.mapData.tilesets[i].image; // задание пути к изображению
            var t = this.mapData.tilesets[i]; //забираем tileset из карты
            var ts = { // создаем свой объект tileset
                firstgid: t.firstgid, // с него начинается нумерация в data
                image: img,
                name: t.name, // имя элемента рисунка
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x), // горизонталь
                yCount: Math.floor(t.imageheight / mapManager.tSize.y) // вертикаль
            }; // конец объявления ts
            this.tilesets.push(ts); // сохраняем tileset в массив
        } // окончание цикла for
        this.jsonLoaded = true; // когда разобран весь json
    },

    //100% inspired by metoda
    draw: function (ctx) { // отрисовка карты в контексте
        // если карта не загружена, то повторить прорисовку через 100 мс
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.draw(ctx);
            }, 100);
        } else {
            var layerCount = 0;
            if (this.tLayer === null) {// проверка, что tLayer настроен
                for (var id = 0; id < this.mapData.layers.length; id++) {
                    // проходим по всем layer карты
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                    }
                }
            }
            for (var i = 0; i < this.tLayer.data.length; i++) { // проходим по всей карте
                if (this.tLayer.data[i] !== 0) { // если данных нет, то пропускаем
                    var tile = this.getTile(this.tLayer.data[i]); // получение блока по индексу
                    var pX = (i % this.xCount) * this.tSize.x; // вычисляем x в пикселях
                    var pY = Math.floor(i / this.xCount) * this.tSize.y;
                    // не рисуем за пределами видимой зоны
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;

                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y); //
                    //отрисовка в контексте
                }
            }
        }
    },

    // 100% copied from metoda
    getTile: function (tileIndex) { // индекс блока
        var tile = {
            img: null, // изображение tileset
            px: 0, py: 0 // координаты блока в tileset
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image; // изображение искомого tileset
        var id = tileIndex - tileset.firstgid; // индекс блока в tileset
        // блок прямоугольный, остаток от деления на xCount дает х в tileset
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile; // возвращаем тайл для отображения
    },

    //100% copied from metoda
    getTileset: function (tileIndex) { // получение блока по индексу
        for (var i = mapManager.tilesets.length - 1; i >= 0; i--) {
            // в каждом tilesets[i].firstgid записано число, с которого начинается нумерация блоков
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                // если индекс первого блока меньше , либо равен искомому, значит этот tileset и нужен
                return mapManager.tilesets[i];
            }
        }
        return null;
    },

    //100% copied from metoda
    isVisible: function (x, y, width, height) {
        // не рисуем за пределами видимой зоны
        return !(x + width < this.view.x
        || y + height < this.y
        || x > this.view.x + this.view.w
        || y > this.view.y + this.view.h);

    },

    //100% copied from metoda
    parseEntities: function () { // разбор слоя типа objectgroup
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.parseEntities();
            }, 100);
        } else
            for (var j = 0; j < this.mapData.layers.length; j++) // просмотр всех слоев
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j]; // слой с объектами следует разобрать
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];
                        try {
                            var obj = Object.create(gameManager.factory[e.type]);
                            obj.name = e.name;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            obj.pos_x = Math.round(e.x+(obj.size_x/2));
                            obj.pos_y = Math.round(e.y-(obj.size_y/2));
                            if (obj.type === 'hero') {
                                //obj.dirSprite = 'left';
                                gameManager.initHero(obj);
                            }
                            if (obj.type === 'enemy') {
                                //obj.dirSprite = 'right';
                                gameManager.initEnemy(obj);
                            }
                            if (obj.type === 'bonus') {
                               // obj.dirSprite = 'right';
                                gameManager.initBonus(obj);

                            }
                            gameManager.units.push(obj);
                        } catch (ex) {
                            console.log("Error while creating: [" + e.gid + "]" + e.type + " " + ex);
                        }
                    }
                }
    },


    //100% copied from metoda
    getTilesetIdx: function (x, y) {
        // получить блок по координатам на карте
        var wX = x;
        var wY = y;
        var idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    },

    //100% copied from metoda - TODO DISABLED
    centerAt: function (x, y) {
        if (x < this.view.w / 2) // Центрирование по горизонтали
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);
        if (y < this.view.h / 2) // центрирование по вертикали
            this.view.y = 0;
        else if (y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h / 2);
    },
};
