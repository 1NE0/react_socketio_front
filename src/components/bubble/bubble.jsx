


export const Bubble = ({avatar, name, message, isMine}) => {

    return <div className={"flex gap-5" + (isMine ? " flex-row-reverse" : " ")}>
        <div className="w-[50px] h-[50px] p-2 border border-[3px] border-black flex justify-center items-center mt-[25px]">
            <img width={25} src={avatar} />
        </div>
        <div className="flex flex-col gap-2">
            <span className="font-bold">{name}</span>
            <div className={"w-full h-auto p-2 border_pixel_min_grey relative bg-white " + (isMine ? "bubble_mind" : "bubble")} >
                <p>{message}</p>
            </div>
        </div>
        
    </div>
}