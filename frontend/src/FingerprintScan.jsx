import { useState } from 'react'
import axios from 'axios'

const leftFingers = ['Thumb', 'Little', 'Ring', 'Middle', 'Index']
const rightFingers = ['Thumb', 'Index', 'Middle', 'Ring', 'Little']

function FingerprintScan() {
  const [hand, setHand] = useState('left')
  const [scanned, setScanned] = useState([])

  const fingers = hand === 'left' ? leftFingers : rightFingers
  const totalFingers = fingers.length
  const allScanned = scanned.length === totalFingers

  const handleScan = (finger) => {
    if (!scanned.includes(finger)) {
      const updated = [...scanned, finger]
      setScanned(updated)

      console.log(`Scanned ${hand} hand - ${finger}`)
    }
  }

  const sendToBackend = async () => {
    try {
      await axios.post('http://localhost:5000/fingerprint', {
        hand,
        fingers: scanned
      })
    } catch (err) {
      console.error('Failed to save fingerprint data')
    }
  }

  const handleNextHand = async () => {
    if (!allScanned) return

    await sendToBackend()

    if (hand === 'left') {
      setHand('right')
      setScanned([])
    } else {
      alert('Fingerprint scanning complete!')
    }
  }

  return (
    <div className="scan-page">
      <header className="scan-header">
        <h2>{hand === 'left' ? 'Scan Left Hand' : 'Scan Right Hand'}</h2>
        <p>Click each finger to scan</p>
        <p className="progress">
          {scanned.length} / {totalFingers} fingers scanned
        </p>
      </header>

      <main className="hand-container">
        <div className={`hand-ui ${hand}`}>

          {/* Fingers */}
          <div className="fingers-row">
            {fingers.slice(1).map((finger, idx) => (
              <div
                key={idx}
                className={`finger-box ${scanned.includes(finger) ? 'scanned' : ''}`}
                onClick={() => handleScan(finger)}
              >
                {finger}
              </div>
            ))}
          </div>

          {/* Thumb */}
          
          <div
            className={`thumb ${scanned.includes('Thumb') ? 'scanned' : ''}`}
            onClick={() => handleScan('Thumb')}
          >
            Thumb
          </div>

        </div>

        <button
          className="next-hand"
          onClick={handleNextHand}
          disabled={!allScanned}
        >
          {hand === 'left' ? 'Next: Right Hand' : 'Finish Scanning'}
        </button>
      </main>
    </div>
  )
}

export default FingerprintScan
