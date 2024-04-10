import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ContentBody from './components/content/content';
import FormContent from './components/form/formContent';
import { Message } from './models/message';
import kaboom from 'kaboom';
import { GeneralGame } from './models/general';
import { Player } from './models/player';
import generateBubble from './models/bubble';

export const socket = io(import.meta.env.VITE_URL_BACK + ':' + import.meta.env.VITE_PORT);

function App() {
  const [users, setUsers] = useState([]);
  const [generalGame, setGeneralGame] = useState(null);
  const [msgs, setMsgs] = useState({});



  const usersRef = useRef(users);
  let movAnterior = null;

  useEffect(() => {
    const gm = new GeneralGame();
    setGeneralGame(gm);

    gm.init("canvas");

    scene("main", (levelIdx) => {
      gm.generateMap();
      gm.update();
    });

    go("main", 0);

    const createLocalPlayer = ({ id, users }) => {
      const playerObject = gm.initializePlayerLocal(id);
      const playerGame = new Player(id, "sebas", playerObject);
      gm.playerLocal = playerGame;

      const usuariosOnline = Object.values(users);

      usuariosOnline.forEach((user) => {
        if (id != user.id) {
          newUserJoined(user);
        }
      })

      socket.emit('user joined', {
        "id": playerGame.id,
        "nombre": playerGame.name,
        "pos_x": playerGame.objPlayer.pos.x,
        "pos_y": playerGame.objPlayer.pos.y
      })
    }

    const moveUserOther = ({ playerId, pos, dir }) => {
      const currentUsers = usersRef.current;
      const playerToUpdate = currentUsers[playerId];

      if (playerToUpdate) {
        playerToUpdate.objPlayer.pos.x = pos.x;
        playerToUpdate.objPlayer.pos.y = pos.y;
        playerToUpdate.objPlayer.dir = dir;

        let direction;
        if (dir.x === 0 && dir.y === -1) {
          direction = 'up';
        } else if (dir.x === 0 && dir.y === 1) {
          direction = 'down';
        } else if (dir.x === -1 && dir.y === 0) {
          direction = 'left';
        } else if (dir.x === 1 && dir.y === 0) {
          direction = 'right';
        } else {
          playerToUpdate.objPlayer.stop();
          return;
        }

        if (movAnterior !== direction) {
          playerToUpdate.objPlayer.play(direction);
          movAnterior = direction;
        } else {
          console.log("misma direccion");
        }
      }
    }

    const newUserJoined = (user) => {
      const playerObject = gm.userJoined(user);
      
      setUsers((usersPrev) => ({
        ...usersPrev,
        [playerObject.id]: playerObject
      }));
    }

    const disconected = (id) => {
      setUsers((usersPrev) => {
        const newUsers = { ...usersPrev };
        destroy(newUsers[id].objPlayer);
        delete newUsers[id];
        return newUsers;
      });
    }

    const onMessage = ({message, playerId}) => {
      console.log(message, playerId);

      const currentUsers = usersRef.current;
      const player = currentUsers[playerId];
      // bubble
      const newBubble = generateBubble(message, player.objPlayer);

      player.addMessage(message);

    };

    socket.on('put ID', createLocalPlayer);
    socket.on('user joined recept', newUserJoined);
    socket.on('user moved recept', moveUserOther);
    socket.on('playerDisconnected', disconected);
    socket.on('message recept', onMessage);


    return () => {
      socket.off('user joined recept', newUserJoined);
      socket.off('user moved recept', moveUser);
    };
  }, []);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  return (
    <>
      <div className='px-8 w-[100vw] h-[100vh] flex justify-center items-center bg-white dark:bg-gray-900'>
        <FormContent kaboom={kaboom} generalGame={generalGame} />
        <canvas id="canvas"></canvas>
      </div>
    </>
  )
}

export default App;
