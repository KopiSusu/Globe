things to do!

!!!! IMPORTANT !!!!!
FIX LOADING ISSUE!!!
  wait for all content to load prior to loading orbitcontrol?
  takes several refresh to start up globe?!?

map:
  continents:
    seperate the continents by country
    check to see if particle is inside country(check to see if point is inside complex polygon)
    

basic controls:
  globe controls: 
    zooming in function
    spin globe function

  particle controls:
    on zoom out:
      show agregate of particles
      disable movable particles 

    on zoom in:
      clickable particles
      enable movable particles

game logic:
  add game ui
  add armies for winning teritories? maybe 
  add timer bar at the top (cool addition)

  maybe add some math to determine 
  {
    both teams must suffer loses
    1:1 loss?
  } 

  with 3 users attack a single point 
  {
    stretch goal: need ocupation force to hold territory
  }

  fairness (stretch goal)
  {
    need to work out fairness somehow? or even if we want this? 
  }

  notification system 
  {
    add status log bar
  }


user stories = game mechanics
  what is an allowable move
  constraints 
  {
    like : 
      how long a turn lasts
  }



ui: 
{

}

every turn 
{
  relocate troops to adjacent 
  attack task
}

only post at end of turn 
otherwise just store changes localy

look up sockets 
{

}

game state 
{
loop through territories,
figure out how many troops has been moved in each territory,
at end of turn 
  {
    calculate new game state
    basically remap the whole globe.
  }
}

need two node servers
game and browser servers

things to do in order
1. progress bar
2. json for game state
3. change colour of territory based on contol
4. represent troops in territory
5. be able to move troops
    a. select
    b. move

1. websockets











  