from fastapi import APIRouter, status, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import exc
from api.schemas.language_schema import LanguageSchemaRequest
from models.language_model import LanguageModel

from api.repository.user_transactions import get_update_by


def create_language_in_db(request: LanguageSchemaRequest, db: Session, username):

    updated_by = get_update_by(db, username)
   
    language_name = beautify_name(request.name)   

    try:
        new_language = LanguageModel(         
            name=language_name,
            updated_by=updated_by
        )
        db.add(new_language)
        db.commit()
        db.refresh(new_language)
        return new_language.id
    except exc.SQLAlchemyError as e: 
        error_msg = str(e.__dict__['orig'])
        stat = status.HTTP_400_BAD_REQUEST
        if "duplicate" in error_msg or "already exists" in error_msg:
            stat = status.HTTP_409_CONFLICT
        err = error_msg.split("DETAIL")
        if len(err)>1:
           error_msg =  err[1]
        raise HTTPException(status_code=stat, detail=error_msg)



def beautify_name(lang_name):
    
    if lang_name.lower() == 'asl':
        return lang_name.upper()

    if "-" in lang_name:
        names = lang_name.split("-")
        seperator = "-"
    elif "(" in lang_name:
        names = lang_name.split("(")
        seperator = " ("
    elif "<>" in lang_name:
        names = lang_name.split("<>")
        seperator = " <> "
    else:
        names = lang_name.split(" ")
        seperator = " "

    language_name = ""
    for name in names:
        language_name = language_name + name.strip().capitalize() + seperator
    language_name=language_name[:-len(seperator)]

    if len(language_name)==0 or language_name is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language name is missing")
    
    return language_name



def modify_language_in_db(id: int, request: LanguageSchemaRequest, db: Session, username):

    updated_by = get_update_by(db, username)
    
    language_name = beautify_name(request.name)

    language_query = db.query(LanguageModel).filter( LanguageModel.id==id)    
    if not language_query.first():
        raise HTTPException(status_code=404, detail=f"language does not exist.")
        
    try:
        language_query.update({ "name": language_name, "updated_by":updated_by})    
        db.commit()

    except exc.SQLAlchemyError as e: 
        error_msg = str(e.__dict__['orig'])
        stat = status.HTTP_400_BAD_REQUEST
        if "duplicate" in error_msg or "already exists" in error_msg:
            stat = status.HTTP_409_CONFLICT
        err = error_msg.split("DETAIL")
        if len(err)>1:
           error_msg =  err[1]
        raise HTTPException(status_code=stat, detail=error_msg)
    
    return "updated successfully."