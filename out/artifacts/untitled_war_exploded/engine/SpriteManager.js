var spriteManager = {
    image: new Image(),
    sprites: [],
    imgLoaded: false,
    jsonLoaded: false,
    angles: new Map(),

    //100% copied from metoda
    loadAtlas: function (atlasJson, atlasImg) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                spriteManager.parseAtlas(request.responseText);
            }
        };
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    },

    //100% copied from metoda
    loadImg: function (imgName) { // загрузка изображения
        this.image.onload = function () {
            spriteManager.imgLoaded = true;
        };
        this.image.src = imgName;
    },


    //100% copied from metoda
    parseAtlas: function (atlasJSON) { // разбор атласа с обеъектами
        var atlas = JSON.parse(atlasJSON);
        for (var i in atlas) { // проход по всем frames
            var frame = atlas[i];
            this.sprites.push({name: frame.name, x: frame.x, y: frame.y, w: frame.width, h: frame.height}); // сохранение характеристик frame в виде объекта
        }
        this.jsonLoaded = true; // атлас разобран
    },

    init: function () {

        this.angles.set('1' + '0', 0);
        this.angles.set('1' + '1', 45);
        this.angles.set('0' + '1', 90);
        this.angles.set('-1' + '1', 135);
        this.angles.set('-1' + '0', 180);
        this.angles.set('-1' + '-1', 225);
        this.angles.set('0' + '-1', 280);
        this.angles.set('1' + '-1', 325);
    },


    //100% copied from metoda
    drawSprite: function (ctx, type, direction, x, y) {
        let spriteName;
        if (direction) {
            spriteName = direction + '_' + type;
        } else {
            spriteName = type;
        }
        console.log(spriteName);
        // если изображение не загружено, то повторить запрос через 100 мс
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                spriteManager.drawSprite(ctx, spriteName, x, y);
            }, 100);
        } else {
            var sprite = this.getSprite(spriteName); // получить спрайт по имени
            if (!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
                return; // не рисуем за пределами видимой зоны
            }
            x -= mapManager.view.x;
            y -= mapManager.view.y;
            // отображаем спрайт на холсте

            ctx.drawImage(this.image, sprite.x,
                sprite.y, sprite.w, sprite.h, x - (sprite.h / 2),
                y - ( sprite.h / 2), sprite.w, sprite.h);

        }
    },

    //100% copied from metoda
    getSprite: function (name) { // получить спрайт по имени
        for (var i = 0; i < this.sprites.length; i++) {
            var s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null; // не нашли спрайт
    }
};