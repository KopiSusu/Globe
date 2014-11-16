Current Project:
=============

3D real-time Risk! made using Three.js and Node.

We grabbed geodesic coordinates for the world's coastlines and did some math to convert them to cartesian coordinates, which we then mapped onto a sphere (generated with Three.js and more math).

Click on the globe and drag to rotate globe.

Globe takes a second to load

=============
Go to http://kopisusu.github.io/Globe/ to check it out!
As we are currently using gh-pages, game is currently static


============
Timer logic

x = length of turn in seconds
Server:
Send game state
  Set timer for x+1
  Accept moves
  Timer ends, stop accepting moves
    Evaluate game state
      Send game state

Client:
Receive game state
  Render game state
    Start timer for x
    Accept moves
    Timer ends, stop accepting moves
    PAUSE and wait for next game state
