import React from 'react'

export default function InterpreterName({
  interpreter,
  setInterpreter,
}: {
  interpreter?: any,
  setInterpreter: Function,
}) {
  return interpreter ? (
    <span
      className='linkSpan pointer'
      onClick={
        () => setInterpreter(interpreter.id)
      }
    >
      {interpreter.firstName} {interpreter.lastName}
    </span>
  ) : <span>-</span>
}
