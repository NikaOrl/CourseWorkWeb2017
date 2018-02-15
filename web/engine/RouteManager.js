class PathNode {
    constructor(scheduledForProcessing = false, distance = 0, x = 0, y = 0) {
        this.distanceCalculated = scheduledForProcessing;
        this.distance = distance;
        this.x = x;
        this.y = y;
    }
}

//poisk v shiriny
class RouteManager {

    constructor(map_w, map_h) {
        this.map_w = map_w;
        this.map_h = map_h;
        this.graph = [];
    }


    getRouteToRandomNode(fromX, fromY) {
        this.markGraphDistance(fromX, fromY);
        let toX = Math.round(Math.random() * (this.map_w-1));
        let toY = Math.round(Math.random() * (this.map_h-1));

        return this._getShortestRoute(fromX, fromY, toX, toY);
    }

    getRoute(fromX, fromY, toX, toY) {
        this.markGraphDistance(fromX, fromY);
        return this._getShortestRoute(fromX, fromY, toX, toY);
    }


    _getShortestRoute(fromX, fromY, toX, toY) {
        let invertedPath = [];
        let cameToBegining = toX === fromX && toY === fromY;


        var counter = 100;
        while (!cameToBegining) {
            counter--;
            let currentDistance = this.graph[toX][toY].distance;


            [[toX + 1, toY],
                [toX - 1, toY],
                [toX, toY + 1],
                [toX, toY - 1]]
                .forEach(n => {
                    let x = n[0];
                    let y = n[1];
                    if (!this.isNodeValid(x, y)) {
                        return;
                    }

                    if (this.graph[x][y].distance < currentDistance) {
                        currentDistance = this.graph[x][y].distance;
                        toX = x;
                        toY = y;
                        invertedPath.push(this.graph[x][y]);
                    }
                    cameToBegining = toX === fromX && toY === fromY;
                });
        }

        return invertedPath.reverse();
    }


    markGraphDistance(fromX, fromY) {
        for (let x = 0; x < this.map_w; x++) {
            this.graph[x] = [this.map_h];
        }

        for (let y = 0; y < this.map_h; y++) {
            for (let x = 0; x < this.map_w; x++) {
                this.graph[x][y] = new PathNode(false,0,x,y);
            }
        }

        let from = this.graph[fromX][fromY];
        from.distanceCalculated=true;
        let queue = [from];

        while (queue.length > 0) {
            let head = queue.shift();
            let x = head.x;
            let y = head.y;

            let calculate = (x, y) => {
                if (!this.isNodeValid(x, y)) {
                    return;
                }
                let neighborNode = this.graph[x][y];
                if (!neighborNode.distanceCalculated) {
                    neighborNode.distance = head.distance + 1;
                    neighborNode.distanceCalculated = true;
                    queue.push(neighborNode);
                }
            };
            calculate(x + 1, y);
            calculate(x - 1, y);
            calculate(x, y + 1);
            calculate(x, y - 1);
        }
    }

    isNodeValid(x, y) {
        if (x < 0 || y < 0) {
            return false;
        }
        if (x > (this.map_w - 1) || y > (this.map_h - 1)) {
            return false;
        }
        return true;
    }
}