import { state } from './MyConfig.js'
import * as THREE from 'three'



/**
 * Each state class should implement:
 *   onEnter(app), onUpdate(app, dt), onExit(app)
 * so the MyGameStateManager can coordinate them.
 */

// Example: Main Menu State
class MainMenuState {
  onEnter(app) {
    console.log('Entering Main Menu...')
    // For example, show an HTML overlay or a 3D panel with "Start Game" button,
    // reset UI fields, etc.
    const menu = document.getElementById('mainMenuOverlay')
    if (menu) {
      menu.style.display = 'block'
    }
    this._boundKeyDown = this.onKeyDown.bind(this, app)
    document.addEventListener('keydown', this._boundKeyDown)
  }

  onUpdate(app, dt) {
    // Check if user triggers the start of the game (e.g., clicked a button or pressed a key)
    // If so:
    //    app.gameStateManager.changeState(state.playing);
  }

  onExit(app) {
    console.log('Exiting Main Menu...')
    // HIDE the menu overlay
    const menu = document.getElementById('mainMenuOverlay')
    if (menu) {
      menu.style.display = 'none'
    }

    // Stop listening for keydown
    document.removeEventListener('keydown', this._boundKeyDown)
  }

  onKeyDown(app, event) {
    if (event.key === 'Enter') {
      app.gameStateManager.changeState(state.chooseUserName) // Change to choose username state
    }
  }
}

// Example: Playing State
class PlayingState {
  onEnter(app) {
    console.log("Game is now in 'playing' mode.")

    // Show username and balloon selection
    const usernameDisplay = document.getElementById('usernameDisplay')
    if (usernameDisplay && app.username) {
      usernameDisplay.innerText = `Player: ${app.username} | Balloon: ${
        app.selectedBalloon || 'None'
      }`
      usernameDisplay.style.display = 'block'
    }

    const timerDisplay = document.getElementById('timerDisplay')
    if (!timerDisplay) {
      console.error('Timer display element not found!')
      return
    }

    timerDisplay.style.display = 'block' // Show timer
    timerDisplay.innerText = `Time: 0.00s` // Initial text
    app.timer.start() // Start the timer
    app.lapsCompleted = 0 // Reset laps
    app.opponentLaps = 0

    this._boundKeyDown = this.onKeyDown.bind(this, app)
    document.addEventListener('keydown', this._boundKeyDown)
  }

  onUpdate(app, dt) {
    console.log('Updating timer...') // Check if this runs
    const timerDisplay = document.getElementById('timerDisplay')
    const elapsedTime = app.timer.getElapsedTime()
    timerDisplay.innerText = `Time: ${elapsedTime.toFixed(2)}s` // Update timer

    // Check if the race is completed
    if (app.lapsCompleted >= app.totalLaps) {
      console.log('Race completed!')
      app.raceWinner =
        app.lapsCompleted > app.opponentLaps ? app.username : 'Opponent'
      app.raceTime = Math.round(elapsedTime)
      app.gameStateManager.changeState(state.results) // Show results state
    }
  }

  onExit(app) {
    console.log("Exiting the 'playing' state.")
    document.removeEventListener('keydown', this._boundKeyDown)

    // Hide the username display
    const usernameDisplay = document.getElementById('usernameDisplay')
    if (usernameDisplay) {
      usernameDisplay.style.display = 'none'
    }

    // Hide the timer display
    const timerDisplay = document.getElementById('timerDisplay')
    timerDisplay.style.display = 'none' // Hide timer
  }

  onKeyDown(app, event) {
    if (event.key === 'Escape' || event.key === 'p') {
      app.gameStateManager.changeState(state.pause) // Change to pause mode
    }

    // **Debugging shortcut to end race immediately**
    if (event.key === 'e') {
      // Press "E" to end race for testing
      app.raceWinner = app.username || 'Player'
      app.raceTime = Math.round(app.timer.getElapsedTime()) // Capture elapsed time
      app.gameStateManager.changeState(state.results) // Trigger results screen
    }
  }
}

class PauseState {
  onEnter(app) {
    console.log('Entering Pause State...')
    const pauseOverlay = document.getElementById('pauseOverlay')
    if (pauseOverlay) pauseOverlay.style.display = 'block' // Show pause menu

    this._boundKeyDown = this.onKeyDown.bind(this, app)
    document.addEventListener('keydown', this._boundKeyDown)
  }

  onUpdate(app, dt) {
    // The scene is "paused," so presumably we do NOT update normal game logic.
    // If you want certain animations or background music to keep playing, handle it here.
    // Typically you do nothing in a paused state, or run a minimal UI logic.
  }

  onKeyDown(app, event) {
    if (event.key === 'Escape' || event.key === 'p') {
      app.gameStateManager.changeState(state.playing) // Unpause and return to playing
    }
  }

  onExit(app) {
    console.log('Exiting Pause State...')
    const pauseOverlay = document.getElementById('pauseOverlay')
    if (pauseOverlay) pauseOverlay.style.display = 'none' // Hide pause menu
    document.removeEventListener('keydown', this._boundKeyDown) // Clean up
  }
}     
class ChooseUsernameState {
  onEnter(app) {
    console.log('Entering Choose Username State...')

    // Create and show the username overlay
    const usernameOverlay = document.createElement('div')
    usernameOverlay.id = 'usernameOverlay'
    usernameOverlay.style.position = 'absolute'
    usernameOverlay.style.top = '0'
    usernameOverlay.style.left = '0'
    usernameOverlay.style.width = '100%'
    usernameOverlay.style.height = '100%'
    usernameOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    usernameOverlay.style.color = 'white'
    usernameOverlay.style.textAlign = 'center'
    usernameOverlay.style.fontSize = '24px'
    usernameOverlay.style.zIndex = '10'
    usernameOverlay.innerHTML = `
      <h1>Enter Your Username</h1>
      <input type="text" id="usernameInput" placeholder="Your Name" style="font-size: 20px; padding: 10px;" />
      <button id="submitUsernameButton" style="font-size: 20px; margin-top: 10px;">Submit</button>
    `
    document.body.appendChild(usernameOverlay)

    // Add the event listener for the submit button
    const submitButton = document.getElementById('submitUsernameButton')
    submitButton.addEventListener('click', () => {
      const usernameInput = document.getElementById('usernameInput')
      const username = usernameInput.value.trim()
      if (username) {
        console.log(`Username submitted: ${username}`)
        app.username = username // Store the username in the app
        app.gameStateManager.changeState(state.chooseBalloon) // Instead of state.playing
      } else {
        alert('Please enter a valid username.')
      }
    })
  }

  onUpdate(app, dt) {
    // No special logic needed in this example
  }

  onExit(app) {
    console.log('Exiting Choose Username State...')
    const usernameOverlay = document.getElementById('usernameOverlay')
    if (usernameOverlay) {
      usernameOverlay.remove() // Remove the overlay when exiting
    }
  }
}


class ChooseBalloonState {
  onEnter(app) {
    console.log('Entering Choose Balloon State...')

    // Create and show the balloon selection overlay
    const balloonOverlay = document.createElement('div')
    balloonOverlay.id = 'balloonOverlay'
    balloonOverlay.style.position = 'absolute'
    balloonOverlay.style.top = '0'
    balloonOverlay.style.left = '0'
    balloonOverlay.style.width = '100%'
    balloonOverlay.style.height = '100%'
    balloonOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    balloonOverlay.style.color = 'white'
    balloonOverlay.style.textAlign = 'center'
    balloonOverlay.style.fontSize = '24px'
    balloonOverlay.style.zIndex = '10'
    balloonOverlay.innerHTML = `
      <h1>Select Your Balloon</h1>
      <div id="balloonOptions" style="display: flex; justify-content: center; gap: 20px;">
        <button id="balloon1" style="padding: 20px;">Balloon 1</button>
        <button id="balloon2" style="padding: 20px;">Balloon 2</button>
        <button id="balloon3" style="padding: 20px;">Balloon 3</button>
      </div>
    `
    document.body.appendChild(balloonOverlay)

    // Add event listeners for balloon selection
    document.getElementById('balloon1').addEventListener('click', () => {
      this.selectBalloon(app, 'balloon1')
    })
    document.getElementById('balloon2').addEventListener('click', () => {
      this.selectBalloon(app, 'balloon2')
    })
    document.getElementById('balloon3').addEventListener('click', () => {
      this.selectBalloon(app, 'balloon3')
    })
  }
  findMeshByName(parent, name) {
    console.log(
      'Searching for mesh:',
      name,
      'in parent:',
      parent.name || parent.id
    )

    let found = parent.getObjectByName(name)
    if (found) {
      console.log('Found mesh:', name)
      return found
    }

    // Recursively check children
    for (let i = 0; i < parent.children.length; i++) {
      found = this.findMeshByName(parent.children[i], name)
      if (found) return found
    }

    console.warn('Mesh not found in:', parent.name || parent.id)
    return null
  }

  /**
   * Handle balloon selection and transition to the playing state
   */
  selectBalloon(app, balloonType) {
    console.log(`Balloon selected: ${balloonType}`)
    app.selectedBalloon = balloonType

    // Log the entire balloon node
    console.log('app.balloon:', app.balloon) // Check if the balloon object exists

    if (!app.balloon) {
      console.error('Balloon is not loaded.')
      return
    }

    const textureLoader = new THREE.TextureLoader()
    let texturePath = ''

    switch (balloonType) {
      case 'balloon1':
        texturePath = 'game/textures/balloon.jpg'
        break
      case 'balloon2':
        texturePath = 'game/textures/balloon2.jpg'
        break
      case 'balloon3':
        texturePath = 'game/textures/balloon3.jpg'
        break
    }

    textureLoader.load(
      texturePath,
      (texture) => {
        console.log('Texture loaded successfully:', texturePath)
        console.log(
          'Finding "envelopeUpLod" in app.balloon:',
          app.balloon.children
        )

        const envelopeUpLod = this.findMeshByName(app.balloon, 'envelopeUpLod')
        console.log('Found envelopeUpLod:', envelopeUpLod)

        let envelope = null
        if (envelopeUpLod) {
          envelope = this.findMeshByName(envelopeUpLod, 'envelopeUpNormal')
          console.log('Found envelopeUpNormal:', envelope)
        }

        if (envelope) {
          console.log('Applying texture to:', envelope.name)
          envelope.material.map = texture
          envelope.material.needsUpdate = true
        } else {
          console.error('Could not find envelope mesh for texture application.')
        }

        app.gameStateManager.changeState(state.playing)
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error)
        alert(`Failed to load texture: ${texturePath}`)
      }
    )
  }
  onUpdate(app, dt) {
    // Even if you do nothing here, this prevents the error.
  }
  onExit(app) {
    console.log('Exiting Choose Balloon State...')
    const balloonOverlay = document.getElementById('balloonOverlay')
    if (balloonOverlay) {
      balloonOverlay.remove() // Remove overlay when exiting
    }
  }
}



// Example: End/Results State
class EndState {
  onEnter(app) {
    console.log('Entering the Results/End State...');

    // Show the results overlay
    const resultsOverlay = document.createElement('div');
    resultsOverlay.id = 'resultsOverlay';
    resultsOverlay.style.position = 'absolute';
    resultsOverlay.style.top = '0';
    resultsOverlay.style.left = '0';
    resultsOverlay.style.width = '100%';
    resultsOverlay.style.height = '100%';
    resultsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    resultsOverlay.style.color = 'white';
    resultsOverlay.style.textAlign = 'center';
    resultsOverlay.style.fontSize = '24px';
    resultsOverlay.style.zIndex = '10';
    resultsOverlay.innerHTML = `
      <h1>Race Results</h1>
      <p>Player: ${app.username || 'Unknown'} | Balloon: ${
      app.selectedBalloon || 'Unknown'
    }</p>
      <p>Opponent: ${
        app.opponentBalloon || 'Unknown'
      }</p>
      <p>Winner: ${app.raceWinner || 'Unknown'}</p>
      <p>Race Time: ${app.raceTime || 'Unknown'} seconds</p>
      <div>
        <button id="restartRaceButton" style="margin: 10px;">Restart Race</button>
        <button id="mainMenuButton" style="margin: 10px;">Main Menu</button>
      </div>
    `;
    document.body.appendChild(resultsOverlay);

    // Add event listeners for buttons
    document
      .getElementById('restartRaceButton')
      .addEventListener('click', () => {
        app.lapsCompleted = 0 // Reset race progress
        app.opponentLaps = 0
        app.timer.start() // Reset timer
        app.gameStateManager.changeState(state.playing) // Restart race
      })

    document.getElementById('mainMenuButton').addEventListener('click', () => {
      app.gameStateManager.changeState(state.start) // Go back to main menu
    })


    // Trigger festive effects (e.g., fireworks)
    this._startFireworks(app);
  }

  onUpdate(app, dt) {
    // Nothing to update for now
  }

  onExit(app) {
    console.log('Exiting Results/End State...');

    // Remove the results overlay
    const resultsOverlay = document.getElementById('resultsOverlay');
    if (resultsOverlay) {
      resultsOverlay.remove();
    }

    // Stop fireworks effects
    this._stopFireworks(app);
  }

  _startFireworks(app) {
    // Initialize and start the particle system
    const fireworksGroup = new THREE.Group();
    app.scene.add(fireworksGroup);
    this.fireworksGroup = fireworksGroup;

    for (let i = 0; i < 5; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
      );
      particle.position.set(
        Math.random() * 10 - 5,
        Math.random() * 5 + 5,
        Math.random() * 10 - 5
      );
      fireworksGroup.add(particle);
    }
  }

  _stopFireworks(app) {
    if (this.fireworksGroup) {
      app.scene.remove(this.fireworksGroup);
      this.fireworksGroup.children.forEach((child) => {
        child.geometry.dispose();
        child.material.dispose();
      });
    }
  }
}


export { MainMenuState, PlayingState, EndState, PauseState, ChooseUsernameState, ChooseBalloonState }
