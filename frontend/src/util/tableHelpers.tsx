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

export {
  comments,
}