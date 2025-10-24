// This function defines the Fire module for decoration.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the fire
// - `y` - The initial y position of the fire
const Fire = function (ctx, x, y) {

    // Fire sprite animation sequence
    const fireSequence = {
        x: 0, y: (16 * 10), width: 16, height: 16, count: 8, timing: 150, loop: true
    };

    // Create sprite for the fire
    const sprite = Sprite(ctx, x, y);

    // Configure the fire sprite
    sprite.setSequence(fireSequence)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("assets/object_sprites.png");

    return {
        draw: sprite.draw,
        update: sprite.update
    };
};