'use strict'

const $ = window.$
let ctx
let canvasref
let Bubbles

$(function () {
  // Install Background
  const documentWidth = $(document).width()
  const documentHeight = $(document).height()
  const newCanvas = $('<canvas/>', {
    id: 'canvas',
    width: documentWidth,
    height: documentHeight,
    style: 'position:fixed top:0 left:0'
  }).prop({
    width: documentWidth,
    height: documentHeight
  })
  $('#background').html(newCanvas)

  ctx = document.getElementById('canvas').getContext('2d')
  canvasref = document.getElementById('canvas')

  const canvasWidth = canvasref.width
  const canvasHeight = canvasref.height
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  Bubbles = new BubbleChamber()
  Bubbles.ctx = ctx
  Bubbles.canvasHeight = canvasHeight
  Bubbles.canvasWidth = canvasWidth
  Bubbles.cavasref = canvasref
  Bubbles.init()

  // Run draw every millisecond
  setInterval(drawFrame, 1)
})

function drawFrame (event) {
  Bubbles.runDraw()
}

const BubbleChamber = function () {
  this.limit = 4
  this.beamNumber = 100
  this.beamAngleWidth = Math.PI / 4
  this.topBeamWidth = 800
  this.initialBeamWidth = 50

  this.beamColor = 'rgba(96,96,96,0.50)'
  this.particleColor = 'rgba(96,96,96,0.051)'
  this.particleDecayColor = 'rgba(96,96,96,0.41)'

  this.particleArray = []
  this.particleBeamArray = []

  this.theta = Math.PI
  this.thetaSpeed = 2 * Math.PI / 100
}

BubbleChamber.prototype.init = function () {
  this.topBeamWidth = this.canvasWidth * 1.5
  this.particleRadiusBase = Math.sqrt(this.canvasHeight * this.canvasHeight + this.canvasWidth * this.canvasWidth) / 18
  this.beamAngleWidth = Math.atan((this.topBeamWidth / 2) / this.canvasHeight)

  // Create the beams
  for (let i = 0; i < this.beamNumber; i++) {
    const p = {}
    this.newParticle(p, this.canvasWidth / 2, this.canvasHeight, 1, true)
    p.vx = 0
    p.vy = -2
    p.vx0 = 0
    p.vy0 = -0.0001 * Math.random()
    this.particleBeamArray[i] = p
  }
}

BubbleChamber.prototype.newParticle = function (p, xPos, yPos, d, isBeam) {
  p.xPos = xPos
  p.yPos = yPos
  p.splitCount = 0

  p.r = this.particleRadiusBase + Math.random() * this.particleRadiusBase
  p.theta = Math.random() * 2 * Math.PI
  p.thetaSpeed = Math.random() * 2 * Math.PI / 120 * d
  p.radialDecay = 0.995 - Math.random() * 0.09
  p.radialDecay = 0.99 + Math.random() * 0.01
  p.fillStyle = this.particleColor
  p.isBeam = isBeam
  if (isBeam) {
    p.r = this.particleRadiusBase + Math.random() * this.particleRadiusBase
    p.theta = (-2 * Math.PI / 4 - this.beamAngleWidth / 2) + Math.random() * this.beamAngleWidth
    p.thetaSpeed = 0
    p.radialDecay = 1
    p.xPos = this.canvasWidth / 2 + this.initialBeamWidth - (Math.random() * this.initialBeamWidth * 2)
    p.yPos = this.canvasHeight
    p.fillStyle = this.beamColor
  }
}

BubbleChamber.prototype.runDraw = function () {
  const newParticlesArray = []
  const removalArray = []

  // Move particles
  for (let i = 0; i < this.particleArray.length; i++) {
    const pRef = this.particleArray[i]
    pRef.xPos += pRef.vx
    pRef.yPos += pRef.vy
    pRef.vx = pRef.vx0 + 0.05 * pRef.r * Math.cos(pRef.theta)
    pRef.vy = pRef.vy0 + 0.05 * pRef.r * Math.sin(pRef.theta)
    pRef.r *= pRef.radialDecay
    pRef.theta += pRef.thetaSpeed

    if (pRef.r < 1 && pRef.r !== 0) {
      // decay into two particles
      // current particle becomes one of the new ones
      removalArray.push(i)

      if (Math.random() > 0.9) {
        this.ctx.fillStyle = '#eee'
        this.ctx.fillRect(pRef.xPos, pRef.yPos, 2, 2)

        for (let d = 0; d < 2; d++) {
          const p = {}
          this.newParticle(p, pRef.xPos + d, pRef.yPos + d, (d === 0) ? 1 : -1, false)
          p.splitCount += 1
          p.vx = 0
          p.vy = 0
          p.vx0 = 0
          p.vy0 = 0
          p.fillStyle = this.particleDecayColor
          newParticlesArray.push(p)
        }
      }
    }

    if (pRef.xPos < 0 || pRef.yPos < 0 || pRef.xPos > this.canvasWidth || pRef.yPos > this.canvasHeight) {
      removalArray.push(i)
    }

    this.ctx.fillStyle = pRef.fillStyle
    this.ctx.beginPath()
    this.ctx.arc(pRef.xPos, pRef.yPos, 1, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fill()
  }

  // cleanups
  for (let i = 0; i < this.particleArray.length; i++) {
    const pRef = this.particleArray[i]
    if (pRef.splitCount > 4) {
      removalArray.push(i)
    }
  }

  for (let i = 0; i < removalArray.length; i++) {
    this.particleArray.splice(removalArray[i], 1)
  }

  this.generateNewParticles()
}

BubbleChamber.prototype.generateNewParticles = function () {
  // TODO: Need to wire this up to trigger from the geiger counter
  const newParticles = this.limit - this.particleArray.length

  for (let i = 0; i < newParticles; i++) {
    let newX = Math.round(this.canvasWidth * Math.random())
    let newY = Math.round(this.canvasHeight * Math.random())
    for (let j = 0; j < this.particleArray.length; j++) {
      while (newX === this.particleArray[j].xPos &&
             newY === this.particleArray[j].yPos) {
        newX = Math.round(this.canvasWidth * Math.random())
        newY = Math.round(this.canvasHeight * Math.random())
      }
    }

    const p = {}
    this.newParticle(p, newX, newY, (Math.random() < 0.5 ? -1 : 1), false)
    p.vx = 0
    p.vy = 0
    const baseSpeed = 0.02
    p.vx0 = Math.random() > 0.5 ? -baseSpeed : baseSpeed
    p.vy0 = Math.random() > 0.5 ? -baseSpeed : baseSpeed
    this.particleArray.push(p)
  }
}
