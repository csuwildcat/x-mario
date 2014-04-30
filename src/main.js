(function(){  

  var standing = '../src/images/mario-standing.png';
  var marioImg = new Image();
      marioImg.src = '../src/images/mario-jumping.png'; //preload the jumping image
      
  xtag.register('x-mario', {
    lifecycle: {
      created: function(){
        this.xtag.isSuper = this.superMario;
        this.xtag.img = this.appendChild(marioImg.cloneNode(true));
        this.xtag.img.src = standing;
        this.xtag.sounds = {};
        ['jump', 'powerup', 'powerdown', 'itsmario', 'goodbye'].forEach(function(file){
          var sound = this.xtag.sounds[file] = new Audio();
          sound.preload = 'auto';
          sound.src = '../src/sounds/' + file + '.mp3';
        }, this);
      },
      inserted: function(){
        this.playSound('itsmario');
      },
      removed: function(){
        this.playSound('goodbye');
      }
    },
    accessors: {
      'superMario': {
        attribute: {
          name: 'super-mario',
          boolean: true
        },
        set: function(val){
          if (document.body.contains(this)) {
            if (val && !this.xtag.isSuper) {
              this.playSound('powerup');
            }
            else if (!val && this.xtag.isSuper) {
              this.playSound('powerdown');
            }
          }
          this.xtag.isSuper = val;
        }
      }
    },
    methods: {
      jump: function(){
        if (!this.classList.contains('jumping')) {
          this.xtag.jumping = true;
          this.xtag.img.src = '../src/images/mario-jumping.png';
          this.classList.add('jumping');
          this.playSound('jump');
        }     
      },
      playSound: function(name){
        var sound = this.xtag.sounds[name];
        if (sound && sound.readyState == 4) {
          sound.pause();
          sound.currentTime = 0;
          sound.play();
        }
      }
    },
    events: {
      tap: function(){
        this.selected = true;
        this.jump();
      },
      animationend: function(e){
        if (e.animationName.match('mario-jump')) {
          this.xtag.img.src = standing;
          this.xtag.sounds.jump.pause();
          this.xtag.sounds.jump.currentTime = 0;
          this.classList.remove('jumping');
        }
      }
    }
  });

})();