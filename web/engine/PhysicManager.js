//80% inspired by metoda
/*var physicManager = {
 update: function (obj) {

 let nodeNum = k => Math.round(k / 32);
 let x = nodeNum(obj.pos_x);
 let y = nodeNum(obj.pos_y);

 gameManager.units.forEach(u=>{
 if(x === nodeNum(u.pos_x) && y===nodeNum(u.pos_y)){
 if(u !==obj) {
 obj.onTouchEntity(u);
 }
 }
 });
 },

 };*/


class PhysicManager {
    update(obj) {

        let nodeNum = k => Math.floor(k / 32);
        let x = nodeNum(obj.pos_x);
        let y = nodeNum(obj.pos_y);

        gameManager.units.forEach(u => {
            if (x === nodeNum(u.pos_x) && y === nodeNum(u.pos_y)) {
                if (u !== obj) {
                    obj.onTouchEntity(u);
                }
            }
        });
    }

}

var physicManager = new PhysicManager();