import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import ContentBody from './components/content/content';
import FormContent from './components/form/formContent';
import { Message } from './models/message';
import kaboom from 'kaboom';
import { GeneralGame } from './models/general';
import { Player } from './models/player';

export const socket = io(import.meta.env.VITE_URL_BACK + ':' + import.meta.env.VITE_PORT);


function App() {
  /*   const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); */

  const [users, setUsers] = useState([]);
  const usersRef = useRef(users); // Ref para almacenar una referencia mutable de users
  let movAnterior = null;
  useEffect(() => {

    GeneralGame.init("canvas");
    
    scene("main", (levelIdx) => {
      GeneralGame.generateMap();
      GeneralGame.update();
    });

    /* debug.inspect = true */
    

    go("main", 0);

    const createLocalPlayer = ({id, users}) => { // id del usuario instanciado, y la lista de todos los usuarios actuales
      const playerObject = GeneralGame.initializePlayerLocal(id);
      const playerGame = new Player(id, "sebas" , playerObject);
      GeneralGame.playerLocal = playerGame;
      

      const usuariosOnline = Object.values(users);

      usuariosOnline.forEach((user) => {
        if(id != user.id){
          newUserJoined(user);
        }
      })
      // notificar a todos de que ingresó un usuario
      socket.emit('user joined', {
        "id" : playerGame.id,
        "nombre" : playerGame.name,
        "pos_x" : playerGame.objPlayer.pos.x,
        "pos_y" : playerGame.objPlayer.pos.y
      })
    }

    const moveUserOther = ({ playerId, pos, dir }) => {
        console.log(playerId);
        const currentUsers = usersRef.current;
        const playerToUpdate = currentUsers[playerId];

        if (playerToUpdate) {
          console.log("encontré el usuario");
          // Actualizar la posición del jugador
          playerToUpdate.objPlayer.pos.x = pos.x;
          playerToUpdate.objPlayer.pos.y = pos.y;
          // Actualizar la dirección si es necesaria para la animación
          playerToUpdate.objPlayer.dir = dir;
          

          console.log(dir);
          // Actualizar la animación del jugador
          // Convertir las coordenadas en una dirección cardinal
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
              // Si no coincide con ninguna dirección conocida, detener la animación
              playerToUpdate.objPlayer.stop();
              return;
          }

          if(movAnterior != direction){
            // Actualizar la animación del jugador
            playerToUpdate.objPlayer.play(direction);
            // actualizar la variable de historial de movimiento
            movAnterior = direction;
          }else{
            console.log("misma direccion");
          }
          

          
        }
    }

    const newUserJoined = (user) => {
      const playerObject = GeneralGame.userJoined(user);
      
      setUsers((usersPrev) => ({
        ...usersPrev, // Mantén los usuarios anteriores
        [playerObject.id]: playerObject // Agrega un nuevo usuario con el ID del jugador como clave
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

    socket.on('put ID', createLocalPlayer );
    socket.on('user joined recept', newUserJoined);
    socket.on('user moved recept', moveUserOther);
    socket.on('playerDisconnected' , disconected)

    return () => {
/*       socket.off('user joined recept', newUserJoined);
      socket.off('user moved recept', moveUser); */
    };


  }, []);



  useEffect(() => {
    // Actualizar la referencia mutable con el valor actual de users
    usersRef.current = users;
    console.log(users);
  }, [users]);

  

  return (
    <>
      <div className='px-8 w-[100vw] h-[100vh] flex justify-center items-center bg-white dark:bg-gray-900'>
        {/* <div className='w-[500px] h-[80vh] bg-blue-200 border_pixel p-2 '>
            <ContentBody listmessages={messages}/>
            <FormContent messages={messages} setMessages={setMessages}/>
        </div> */}

        <canvas id="canvas"></canvas>

      </div>
    </>
  )
}

export default App