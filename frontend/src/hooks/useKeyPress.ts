import { useState, useEffect } from 'react'

function useKeyPress(targetKey: string) {

  const [keyPressed, setKeyPressed] = useState(false)

  function downHandler({ key }: { key: string }) {
    console.log(`keyDown: ${key}`)
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      setKeyPressed(true)
    }
  }

  function upHandler ({ key }: { key: string }) {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }
  }, [])

  return keyPressed;
}

export default useKeyPress
