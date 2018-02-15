
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Game</title>
  </head>
  <body>

  <canvas id="canvas" style="display:none;" >
  </canvas>

  <script>
      var map = "<%=request.getParameter("map") == null ? "map.json" : request.getParameter("map")%>"
  </script>
  <script src="/engine/GameSettings.js"></script>
  <script src="/engine/MapManager.js"></script>
  <script src="/engine/RouteManager.js"></script>
  <script src="/engine/AIManager.js"></script>
  <script src="/engine/SpriteManager.js"></script>
  <script src="/engine/EventsManager.js"></script>
  <script src="/engine/PhysicManager.js"></script>
  <script src="/engine/SoundManager.js"></script>
  <script src="/engine/GameManager.js"></script>
  <script src="/engine/Units.js"></script>
  <script src="/engine.js"></script>

  <script>
    function lunch() {
        gameManager.play('/json/' + map);
        document.getElementById('canvas').style.display='block';
        document.getElementById('menu').style.display='none';
    }
  </script>


  <div id="menu" style="width: 500px; background-image: url(img/badass_legolas_fighting_a_giant_spider_by_loornaa-d770xxk.jpg); background-size: cover; height: 500px; display: block">
    <a href="#" style="text-decoration: none" onclick="lunch()"><h1 style="color: antiquewhite; padding: 50px; text-shadow: #6dfd61 0px 0px 3px">START</h1></a>

  </div>

  <script>
      if(map=="map2.json"){
          lunch();
      }
  </script>

  </body>
</html>
