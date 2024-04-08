/* import { socket } from "../../App"; */
import { Message } from "../../models/message";


const FormContent = ({setMessages}) => {

    const onSubmit = (e) => {
        e.preventDefault();
        const message  = e.target.message.value;
        // AGREGAR A LA LISTA DE MENSAJES
        setMessages((prevMessages) => [...prevMessages, new Message("https://unpkg.com/pixelarticons@1.8.0/svg/user.svg", "Sebastian", message, true)]);

        // ENVIAR AL SERVIDOR
        //socket.emit('chat message', message);

        // ir abajo
        window.scrollTo(0, document.body.scrollHeight);

        // BORRAR MENSAJE ANTERIOR
        e.target.message.value = "";
    }
    
    return <div className="w-full h-[10%] flex justify-center items-center  items-center bg-white relative z-10">
        <form action="" className="w-full h-full flex" onSubmit={onSubmit}>
            <div className="flex w-full border_pixel p-2 ">
                <input name="message" type="text" placeholder="Escribe un mensaje" className="w-[80%]"/>
                <div type="submit" className="w-[20%] flex justify-center">
                    <img width={25} src="https://unpkg.com/pixelarticons@latest/svg/chat.svg" />
                </div>
            </div>
        </form>
    </div>
}

export default FormContent;