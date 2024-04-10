/* import { socket } from "../../App"; */
import { useEffect, useState } from "react";
import { Message } from "../../models/message";
import generateBubble from "../../models/bubble";
import Bubbles from "../../models/bubble";
import { socket } from "../../App";

const FormContent = ({kaboom, generalGame }) => {

    const [bubbles, setBubbles] = useState([]);
    const [firstElement, setFirstElement] = useState(0);
    const onSubmit = (e) => {
        const message  = e.target.message.value;
        const player = generalGame.playerLocal.objPlayer;
        console.log(generalGame.playerLocal.objPlayer.pos.x, generalGame.playerLocal.objPlayer.pos.y);
        e.preventDefault();
        

        // bubble
        const newBubble = generateBubble(message, player);
        

        
        if(bubbles.length > 2){
            bubbles[firstElement].destroy();
            setFirstElement(prev => prev + 1);
        }

        setBubbles([...bubbles, newBubble]);
        

        
        // AGREGAR A LA LISTA DE MENSAJES
        //setMessages((prevMessages) => [...prevMessages, new Message("https://unpkg.com/pixelarticons@1.8.0/svg/user.svg", "Sebastian", message, true)]);

        // ENVIAR AL SERVIDOR
        socket.emit('chat message', {
            "message": message,
            "playerId" : generalGame.playerLocal.id
        });

        // ir abajo
        //window.scrollTo(0, document.body.scrollHeight);

        // BORRAR MENSAJE ANTERIOR
        e.target.message.value = "";
    }

    useEffect(() => {
        console.log(bubbles);
    }, [bubbles])
    
    return <div className="w-[50%] h-[5%] flex justify-center items-center  items-center bg-white fixed bottom-4 z-10">
        <form action="" className="w-full h-full flex" onSubmit={onSubmit}>
            <div className="flex w-full border_pixel p-2 ">
                <input name="message" type="text" placeholder="Escribe un mensaje" className="w-[90%]"/>
                <div type="submit" className="w-[10%] flex justify-center">
                    <img width={25} src="https://unpkg.com/pixelarticons@latest/svg/chat.svg" />
                </div>
            </div>
        </form>
    </div>



}

export default FormContent;