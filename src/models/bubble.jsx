const generateBubble = (message, player) => {

    const bubbleManager = add([
        pos(player.pos.x - 24, player.pos.y - 96),
        color(255, 255, 255),
        z(1001),
    ]);

    const textBubble = bubbleManager.add([
        text(message, {
            size: 24,
            transform: (idx, ch) => ({
                color: color(227, 0, 0),
            }),
        }),
        z(1003),
    ]);

    bubbleManager.add([
        rect(textBubble.width + 20, textBubble.height + 20),
        pos(-10, -10),
        outline(4),
        color(255, 255, 255),
        z(1002),
    ]);

    bubbleManager.onUpdate(() => {
        /* bubbleManager.pos.x = player.pos.x - 24
        bubbleManager.pos.y = player.pos.y - 96 */
    });
};

export default generateBubble;