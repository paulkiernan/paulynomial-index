var ctx;
var canvasref;
var Bubbles;

$(function() {

    // Install Background
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    var newCanvas = $('<canvas/>', {
        'id': 'canvas',
        width: documentWidth,
        height: documentHeight,
        'style': 'position:fixed; top:0; left:0;'
    }).prop({
        width: documentWidth,
        height: documentHeight,
    });
    $("#background").html(newCanvas);

    ctx = document.getElementById('canvas').getContext('2d');
    canvasref = document.getElementById('canvas');

    var canvasWidth = canvasref.width;
    var canvasHeight = canvasref.height;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    Bubbles = new BubbleChamber();
    Bubbles.ctx = ctx;
    Bubbles.canvasHeight = canvasHeight;
    Bubbles.canvasWidth = canvasWidth;
    Bubbles.cavasref = canvasref;
    Bubbles.init();

    // Run draw every millisecond
    var t = setInterval(drawFrame, 1);
});

function drawFrame(event) {
    Bubbles.runDraw();
}

var BubbleChamber = function() {
    this.particleRadiusBase;
    this.limit = 4;
    this.beamNumber = 100;
    this.beamAngleWidth = Math.PI / 4;
    this.topBeamWidth = 800;
    this.initialBeamWidth = 50;

    this.beamColor = "rgba(96,96,96,0.50)";
    this.particleColor = "rgba(96,96,96,0.051)";
    this.particleDecayColor = "rgba(96,96,96,0.41)";

    this.particleArray = [];
    this.particleBeamArray = [];

    this.ctx;
    this.canvasref;
    this.canvasWidth;
    this.canvasHeight;

    this.theta = Math.PI;
    this.thetaSpeed = 2 * Math.PI / 100;
}

BubbleChamber.prototype.init = function() {
    this.topBeamWidth = this.canvasWidth * 1.5;
    this.particleRadiusBase = Math.sqrt(this.canvasHeight * this.canvasHeight + this.canvasWidth * this.canvasWidth) / 18;
    this.beamAngleWidth = Math.atan((this.topBeamWidth / 2) / this.canvasHeight);

    // Create the beams
    for (i = 0; i < this.beamNumber; i++) {
        var p = new Object();
        this.newParticle(p, this.canvasWidth / 2, this.canvasHeight, 1, true);
        p.vx = 0;
        p.vy = -2;
        p.vx0 = 0;
        p.vy0 = -.0001 * Math.random();
        this.particleBeamArray[i] = p;
    }
}

BubbleChamber.prototype.newParticle = function(p, xPos, yPos, d, isBeam) {
    p.xPos = xPos;
    p.yPos = yPos;
    p.splitCount = 0;

    p.r = this.particleRadiusBase + Math.random() * this.particleRadiusBase;
    p.theta = Math.random() * 2 * Math.PI;
    p.thetaSpeed = Math.random() * 2 * Math.PI / 120 * d;
    p.radialDecay = .995 - Math.random() * .09;
    p.radialDecay = .99 + Math.random() * .01;
    p.fillStyle = this.particleColor;
    p.isBeam = isBeam;
    if (isBeam) {
        p.r = this.particleRadiusBase + Math.random() * this.particleRadiusBase;
        p.theta = (-2 * Math.PI / 4 - this.beamAngleWidth / 2) + Math.random() * this.beamAngleWidth;
        p.thetaSpeed = 0;
        p.radialDecay = 1;
        p.xPos = this.canvasWidth / 2 + this.initialBeamWidth - (Math.random() * this.initialBeamWidth * 2);
        p.yPos = this.canvasHeight;
        p.fillStyle = this.beamColor;
    }
}

BubbleChamber.prototype.runDraw = function() {
    var randomFactor = 0;
    var newParticlesArray = [];
    var removalArray = [];

    // Move particles
    for (i = 0; i < this.particleArray.length; i++) {
        var pRef = this.particleArray[i];
        pRef.xPos += pRef.vx;
        pRef.yPos += pRef.vy;
        pRef.vx = pRef.vx0 + .05 * pRef.r * Math.cos(pRef.theta);
        pRef.vy = pRef.vy0 + .05 * pRef.r * Math.sin(pRef.theta);
        pRef.r *= pRef.radialDecay;
        pRef.theta += pRef.thetaSpeed;

        if (pRef.r < 1 && pRef.r != 0) {
            // decay into two particles
            // current particle becomes one of the new ones
            removalArray.push(i);

            if (Math.random() > .9) {
                this.ctx.fillStyle = "#eee";
                this.ctx.fillRect(pRef.xPos, pRef.yPos, 2, 2);

                for (var d = 0; d < 2; d++) {

                    var p = new Object();
                    this.newParticle(p, pRef.xPos + d, pRef.yPos + d, (d == 0) ? 1 : -1, false);
                    p.splitCount += 1;
                    p.vx = 0;
                    p.vy = 0;
                    p.vx0 = 0;
                    p.vy0 = 0;
                    p.fillStyle = this.particleDecayColor;
                    newParticlesArray.push(p);
                }
            }
        }

        if (pRef.xPos < 0 || pRef.yPos < 0 || pRef.xPos > this.canvasWidth || pRef.yPos > this.canvasHeight) {
            removalArray.push(i);
        }

        this.ctx.fillStyle = pRef.fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(pRef.xPos, pRef.yPos, 1, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // cleanups
    for (i = 0; i < this.particleArray.length; i++) {
        var pRef = this.particleArray[i];
        if (pRef.splitCount > 4) {
            removalArray.push(i);
        }
    }

    for (i = 0; i < removalArray.length; i++) {
        this.particleArray.splice(removalArray[i], 1);
    }

    this.generateNewParticles();
}

BubbleChamber.prototype.generateNewParticles = function() {
    // TODO: Need to wire this up to trigger from the geiger counter
    var newParticles = this.limit - this.particleArray.length;

    for (i = 0; i < newParticles; i++) {
        var p = new Object();
        var newX = this.canvasWidth / 2;
        var newY = this.canvasHeight / 2;
        newX = Math.round(this.canvasWidth * Math.random());
        newY = Math.round(this.canvasHeight * Math.random());

        for (j = 0; j < this.particleArray.length; j++) {
            while (newX == this.particleArray[j].xPos && newY == this.particleArray[j].yPos) {
                newX = Math.round(this.canvasWidth * Math.random());
                newY = Math.round(this.canvasHeight * Math.random());
            }
        }

        this.newParticle(p, newX, newY, (Math.random() < .5 ? -1 : 1), false);
        p.vx = 0;
        p.vy = 0;
        var baseSpeed = .02;
        p.vx0 = Math.random() > .5 ? -baseSpeed : baseSpeed;
        p.vy0 = Math.random() > .5 ? -baseSpeed : baseSpeed;
        this.particleArray.push(p);
    }
}
