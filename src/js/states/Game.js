/* globals pixelwidth, pixelheight */
DropSomething.Game = function (game) {
    this.game = game;
    console.log(this.game.CS);
};

DropSomething.Game.prototype = {

	create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Some settings
        this.levelVelocity = -25;
        this.platformCounter = 0;
        this.game.stage.backgroundColor = '#E0F8D0';
        this.platformCounter = 0;

        this.ball = this.add.sprite(this.game.world.width / 2, 32, 'sprites', 'ball');

        this.platform1 = this.game.add.group();
        this.platform2 = this.game.add.group();
        this.platform1.createMultiple(15, 'sprites', 'ground1');
        this.platform2.createMultiple(15, 'sprites', 'ground2');

        this.game.physics.enable(this.ball);
        this.game.physics.enable(this.platform1);
        this.game.physics.enable(this.platform2);

        this.ball.body.bounce.set(0.5);

        this.ball.body.collideWorldBounds = false;
        this.ball.body.mass = 1;
        this.ball.body.gravity.y = 200;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.setInitialPlatforms();
        this.spawnPlatform();
    },

	update: function () {

        this.ball.body.velocity.x = 0;
        this.handleInput();
        this.checkBoundaries();

        if (this.ball.body.velocity.y > 100) {
            this.ball.body.velocity.y = 100;
        }

        this.game.physics.arcade.collide(this.platform1, this.ball);
        this.game.physics.arcade.collide(this.platform2, this.ball);

        this.levelVelocity = -25 - this.platformCounter;

        if (this.ball.y > 144 ) {
            this.ball.y = -16;
        }

    },

	quitGame: function (pointer) {
        //	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');
	},

    handleInput: function() {
        if (this.cursors.left.isDown) {
            this.ball.body.velocity.x = -75;
        }

        if (this.cursors.right.isDown) {
            this.ball.body.velocity.x = 75;
        }
    },

    checkBoundaries: function() {
        if (this.ball.x > this.game.world.width + 16) {
            this.ball.x = -16;
        }

        if (this.ball.x < -16) {
            this.ball.x = this.game.world.width + 16;
        }
    },

    setInitialPlatforms: function() {
        var i = 4;
        var firstLength = 3;

        while(firstLength--) {
            this.setPlatform('1', (this.game.world.width / 2) - 24, firstLength, 48);
        }

        while(i--) {
            var platformLength = this.game.rnd.integerInRange(1, 4);
            var initX = this.game.rnd.integerInRange(0, 160 - (16 * platformLength));

            while (platformLength--) {
                this.setPlatform('1', initX, platformLength, 96 + (48 * i));
            }
        }
    },

    setPlatform: function (type, initX, platformLength, initY) {
        var usePlatformTile1 = this['platform' + type].getFirstDead();

        if (usePlatformTile1 !== null) {
            usePlatformTile1.reset(initX + (16 * platformLength), initY);

            usePlatformTile1.outOfBoundsKill = true;
            usePlatformTile1.checkWorldBounds = true;

            usePlatformTile1.body.velocity.y = this.levelVelocity;
            usePlatformTile1.body.immovable = true;

            usePlatformTile1.body.checkCollision.up = true;
            usePlatformTile1.body.checkCollision.down = true;
            usePlatformTile1.body.checkCollision.left = true;
            usePlatformTile1.body.checkCollision.right = true;
        }
    },

    spawnPlatform: function () {
        this.platformCounter++;

        var type = this.game.rnd.integerInRange(1, 2);
        var platformLength = this.game.rnd.integerInRange(1, 3);
        var initX = this.game.rnd.integerInRange(0, 160 - (16 * platformLength));
        var initY = 160;

        while (platformLength--) {
            this.setPlatform(type, initX, platformLength, initY);
        }

        this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(1,3), this.spawnPlatform, this);
    },


    render: function() {
        this.game.CS.settings.pixelcontext.drawImage(
            this.game.canvas,
            0,
            0,
            this.game.CS.settings.originWidth,
            this.game.CS.settings.originHeight,
            0,
            0,
            this.game.CS.settings.pixelwidth,
            this.game.CS.settings.pixelheight
        );

    }
};