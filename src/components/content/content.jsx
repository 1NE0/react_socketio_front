import { list } from "postcss";
import { BubbleChat } from "../bubble/bubble";
import { useEffect, useRef } from "react";



const ContentBody = ({listmessages}) => {

    const contentRef = useRef(null);
    
    const scrollToBottom = () => {
        if (contentRef.current) {
          const messageBody = contentRef.current;
          messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }
    };

    useEffect(() => {
        //scrollToBottom();
      }, [listmessages]);

    return <>
        <div className="w-full h-[90%] flex flex-col gap-5 overflow-scroll overflow-x-hidden pb-10 content_scroll" ref={contentRef}>
            {listmessages.map((message, index) => <Bubble key={index} avatar={message.getAvatar()} name={message.getName()} message={message.getMessage()} isMine={message.getIsMine()}/>)}
        </div>
    </>
}


export default ContentBody;