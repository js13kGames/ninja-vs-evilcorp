class PlayerSpotter {
    constructor(level) {
        this.level = level;
        this.angle = 0;
        this.halfFov = 0;
        this.maxDistance = 100;
        this.radius = 0;
    }

    get appliedMaxDistance() {
        return (G.easyMode ? 0.7 : 1) * this.maxDistance;
    }

    cycle() {
        if (!this.foundPlayer) {
            this.foundPlayer = this.seesPlayer;
            if (this.foundPlayer) {
                this.level.wasFound();
            }
        }
    }

    get seesPlayer() {
        // Check if the player is close enough, and within the FOV first
        const angleToPlayer = angleBetween(this, this.level.player);
        const distToPlayer = dist(this, this.level.player);

        if (DEBUG && getDebugValue('invisible')) {
            return false;
        }

        if (distToPlayer < PLAYER_RADIUS + this.radius) {
            return true;
        }

        if (abs(normalize(this.angle - angleToPlayer)) > this.halfFov || distToPlayer > this.maxDistance) {
            return false;
        }

        const impact = castRay(this.x, this.y, angleToPlayer, this.appliedMaxDistance);
        return dist(this, impact) >= distToPlayer;
    }

    render() {
        renderVision(
            this.x,
            this.y,
            this.angle - this.halfFov,
            this.angle + this.halfFov,
            this.appliedMaxDistance,
            this.foundPlayer ? '#f00': '#ff0'
        );
    }
}
