AFRAME.registerComponent('player-controller', {
    schema: {
        speed: { type: 'number', default: 0.1 },
        acceleration: { type: 'number', default: 0.005 },
        deceleration: { type: 'number', default: 0.01 },
        jumpForce: { type: 'number', default: 0.3 }
    },

    init: function () {
        this.velocity = new THREE.Vector3();
        this.keys = {};
        this.isGrounded = true;
        this.gravity = -0.015;

        // Écouteurs d'événements pour les touches du clavier
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    },

    onKeyDown: function (e) {
        this.keys[e.key.toLowerCase()] = true;
    },

    onKeyUp: function (e) {
        this.keys[e.key.toLowerCase()] = false;
    },

    tick: function (time, deltaTime) {
        const el = this.el;
        const data = this.data;

        // Mise à jour de la vitesse en fonction des touches pressées
        const moveVector = new THREE.Vector3(0, 0, 0);

        if (this.keys['z']) moveVector.z -= 1;
        if (this.keys['s']) moveVector.z += 1;
        if (this.keys['q']) moveVector.x -= 1;
        if (this.keys['d']) moveVector.x += 1;

        if (moveVector.length() > 0) {
            moveVector.normalize();
            this.velocity.x += moveVector.x * data.acceleration * (deltaTime / 100);
            this.velocity.z += moveVector.z * data.acceleration * (deltaTime / 100);
        }

        // Accélération et Décélération
        this.velocity.x *= (1 - data.deceleration);
        this.velocity.z *= (1 - data.deceleration);

        // Saut
        if (this.isGrounded && this.keys[' ']) {
            this.velocity.y = data.jumpForce;
            this.isGrounded = false;
        }

        // Gravité
        this.velocity.y += this.gravity;

        // Mise à jour de la position
        el.object3D.position.x += this.velocity.x;
        el.object3D.position.y += this.velocity.y;
        el.object3D.position.z += this.velocity.z;

        // Vérification de collision avec le sol
        if (el.object3D.position.y <= 0.5) {
            el.object3D.position.y = 0.5;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
    }
});