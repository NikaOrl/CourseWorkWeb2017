var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

function updateWorld() {
    gameManager.update();
}



