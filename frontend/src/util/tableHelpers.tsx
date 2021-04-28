import React from 'react'
import { Language } from 'constants/interfaces'

function comments (comment?: string, languages?: Language[]) {
  return (
    comment || languages?.some((language: Language) => language.commentOnLevel)
  ) ? (
    <div className='commentList'>
      {comment ? <span>{comment}</span> : null}
      {languages
        ?.filter((language: Language) => language.commentOnLevel)
        .map((language: Language) => <span>{language.languageName} ({language.level}): {language.commentOnLevel}</span> )}
    </div>
  ) : null
}

/**
 * return full name with format: **LastName**, FirstName
 * @param firstName 
 * @param lastName 
 * @returns 
 */
function fullName(firstName: string, lastName: string) {
  return <p><strong>{lastName}</strong>{`, ${firstName}`}</p>
}

export {
  comments,
  fullName,
}