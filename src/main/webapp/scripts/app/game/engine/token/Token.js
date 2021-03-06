Token = function(config){
    this.____init(config);
};

Token.prototype = {

    ____init:function(config){
        config.opacity = 0;

        this.health = config.health;
        this.maxHealth = config.health;
        this.healthBarMaxWidth = 50;

        this.token = new Konva.Image({
            x: 0,
            y: 0,
            width: config.width,
            height: config.height,
            image:config.imageGfx,
            offset:{x:20,y:20}
        });

        this.healthBar = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.healthBarMaxWidth,
            height: 10,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            offset:{x:25,y:35}
        });

        Konva.Group.call(this, {
            x:config.x,
            y:config.y,
            id: config.id
        });

        this.add(this.token);
        this.add(this.healthBar);

        this.className = 'Token';
        this.direction = Direction.EAST;
        this.coordinate = config.coordinate;

    },
    getCoordinate: function(){return this.coordinate;},
    moveTo: function(x,y,duration,finshedMovingCallback){
        var tween = new Konva.Tween({
            node: this,
            duration: duration,
            x: (x*40)+20,
            y: (y*40)+20,
            onFinish: finshedMovingCallback
        });

        tween.play();
        this.coordinate = {x:x,y:y};
    },
    turnTo: function(direction, duration, finshedTurningCallback){
        if(this.direction == direction){
            setTimeout(function() {
                finshedTurningCallback();
            }, 200);
            return;
        }
        var angle = Direction.getKonvaRotation(this.direction, direction);
        var tween = new Konva.Tween({
            node: this.token,
            duration: duration,
            rotationDeg: angle,
            onFinish: finshedTurningCallback
        });

        tween.play();
        this.direction = direction;
    },
    receiveDamage: function(amount, finishedReceivingDamageCallback){

        var damage = new Konva.Text({
            x: this.getX()-10,
            y: this.getY()-20,
            text: ''+amount,
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1
        });
        this.getStage().findOne('#objects').add(damage);

        var tween = new Konva.Tween({
            node: damage,
            duration: 2,
            y:this.getY()-80,
            onFinish: function() {
                damage.destroy();
            }
        });
        tween.play();

        this.health = this.health - amount;
        var newWidth = this.health * this.healthBarMaxWidth / this.maxHealth;
        this.healthBar.width(newWidth);

        finishedReceivingDamageCallback();
    },
    attack:function(x,y,duration,finishedShootingCallback){

        var targetCoordinate = {x:(x*40)+20, y:(y*40)+20};
        var angle = Math.Util.angle(this.x(), this.y(), targetCoordinate.x, targetCoordinate.y);

        var sword = new Konva.Rect({
            x: 0,
            y: 0,
            width: 60,
            height: 3,
            fill: 'white',
            stroke: 'grey',
            strokeWidth: 1
            //offset:{x:25,y:35}
        });
        sword.rotation(angle-45);

        //this.getStage().findOne('#objects').add(sword);
        this.add(sword);
        var tween = new Konva.Tween({
            node: sword,
            duration: duration,
            rotationDeg: angle+45,
            onFinish: function() {
                sword.destroy();
                finishedShootingCallback();
            }
        });

        tween.play();
    },
    shootAt: function(x,y,duration,finishedShootingCallback){

        var targetCoordinate = {x:(x*40)+20, y:(y*40)+20};
        var angle = Math.Util.angle(this.x(), this.y(), targetCoordinate.x, targetCoordinate.y);

        var distance = 20;
        var angleInRad = Math.Util.degToRad(angle);
        var gunfireDetalX = Math.cos(angleInRad) * distance;
        var gunfireDetalY = Math.sin(angleInRad) * distance;


        var bullet = new Konva.Image({
            x: this.getX()+gunfireDetalX,
            y: this.getY()+gunfireDetalY,
            image:Konva.Assets.Bullet,
            scale:{x:0.4,y:0.4},
            offset:{x:60, y:13}
        });
        bullet.rotation(angle);

        this.getStage().findOne('#objects').add(bullet);
        var tween = new Konva.Tween({
            node: bullet,
            duration: duration,
            x: targetCoordinate.x,
            y: targetCoordinate.y,
            onFinish: function() {
                bullet.destroy();
                finishedShootingCallback();
            }
        });

        tween.play();
    },
    spawnToken: function(finishedSpawningCallback){
        var tween = new Konva.Tween({
            node: this,
            duration: 0.5,
            opacity: 1,
            onFinish: finishedSpawningCallback
        });
        tween.play();
    },
    destroyToken: function(finishedDestroyingCallback){

        var deadMarine = new Konva.Image({
            x: this.getX(),
            y: this.getY(),
            offset:{x:20, y:20},
            image:Konva.Assets.TOKEN_DESTROYED,
            width: 40,
            height: 40,
            opacity: 0.0
        });
        this.getStage().findOne('#backgrounds').add(deadMarine);
        this.destroy();

        var self = this;
        var tween1 = new Konva.Tween({
            node: this,
            duration: 0.5,
            opacity: 0,
            onFinish: function(){
                self.destroy();
            }
        });

        var tween2 = new Konva.Tween({
            node: deadMarine,
            duration: 0.5,
            opacity: 1,
            onFinish: finishedDestroyingCallback
        });

        tween1.play();
        tween2.play();
    }
};

Konva.Util.extend(Token, Konva.Group);