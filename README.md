# socket-draw

Experiment done as part of my "30 for 30" coding exercise where I have 30 minutes every day to build something new for 30 days.

In this experiment, the goal was using canvas to create a real-time collaborative drawing application using socket.io.

## Goals

- **Real-Time Collaboration** - Obviously, one of the main goals was to allow multiple users (ie connections) to draw on the "whiteboard" and also see what other users are drawing as they do so in real time.
- **Whiteboard State Persistence** - Most of the examples and tutorials one might find on building something similar completely ignore the existence of any activity prior to someone joining the "room" or session. This project's aim was to ensure that someone joining would see the current state of the whiteboard along with everyone else instead of a fresh slate and activity from after they joined.
- **Collaborative Whiteboard Control** - Because of the aforementioned persistence of the board state, there must be a method to clear the whiteboard of drawings that is user-controlled for all sessions. Otherwise, there would be a point where it was just anarchy with no solution.

## Observations and Notes

- **Rooms are key** - As noted, persisting the state of the board and ensuring that each whiteboard is viewed in their actual state by all users regardless of when they joined means that there are issues the longer the session is. However, allowing users to clear the board means that there's a lot of room for griefing. Creating rooms (either automatically or allowing users to create them) and using links with IDs to invite other folks to the session is a must.
