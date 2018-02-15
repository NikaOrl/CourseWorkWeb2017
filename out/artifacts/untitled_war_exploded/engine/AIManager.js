class AIAction {
    constructor(route = null, type = AIAction.NO_CHANGES_TYPE) {
        this.route = route;
        this.type = type;
    }
}

AIAction.NO_CHANGES_TYPE = 1;
AIAction.START_HUNT_TYPE = 2;
AIAction.WANDER_THE_MAP_TYPE = 3;
AIAction.GO_CLOSER_TO_HERO_TYPE = 4;
AIAction.ATTACK_TYPE = 5;

AIAction.NO_CHANGES = new AIAction();
AIAction.ATTACK = new AIAction(null, AIAction.ATTACK_TYPE);

class AIManager {

    constructor(map_w, map_h, tile_size) {
        this.map_w = map_w;
        this.map_h = map_h;
        this.tile_size = tile_size;
        this.routeManager = new RouteManager(this.map_w, this.map_h);
    }


    directEnemy(enemy, hero) {

        let nodeNum = k => Math.floor(k / this.tile_size);

        let routeIsStraight = (from_x, from_y, to_x, to_y) => {
            if (from_x === to_x) {
                return true;
            }
            if (from_y === to_y) {
                return true;
            }
            return false;
        };

        if (enemy.state === UnitConstants.IDLE_STATE) {
            let route = this.routeManager.getRouteToRandomNode(
                nodeNum(enemy.pos_x),
                nodeNum(enemy.pos_y));

            return new AIAction(route, AIAction.WANDER_THE_MAP_TYPE);
        }

        if (enemy.state === UnitConstants.MOVING_STATE) {
            if (this.heroIsCloseToEnemy(hero, enemy)) {
                if (routeIsStraight(nodeNum(enemy.pos_x),
                        nodeNum(enemy.pos_y),
                        nodeNum(hero.pos_x),
                        nodeNum(hero.pos_y))) {
                    return AIAction.ATTACK;
                }

                let roteToHero = this.routeManager.getRoute(nodeNum(enemy.pos_x),
                    nodeNum(enemy.pos_y),
                    nodeNum(hero.pos_x),
                    nodeNum(hero.pos_y));

                let nodeToPosX = x => x * 32 + Math.floor(32 / 2);
                let nodeToPosY = y => y * 32 + Math.floor(32 / 2);

                roteToHero.shift();


                return new AIAction(roteToHero, AIAction.GO_CLOSER_TO_HERO_TYPE);

            }
        }

        return AIAction.NO_CHANGES_TYPE;
    }

    heroIsCloseToEnemy(hero, enemy) {
        return Math.sqrt(Math.pow(enemy.pos_x - hero.pos_x, 2)
                + Math.pow(enemy.pos_y - hero.pos_y, 2)) < 32 * 6;
    }

}
