import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import UserCases from '../components/UserCases';

const UserCasePage = () => {

    let nameId = useParams();
    //let nameId_int = nameId['id'];

    let [model_note_param, setModelsNotes] = useState([]);

    useEffect(()=>{
        getModelsNotes();
    },[]);

    let getModelsNotes = async() => {
        let response = await fetch(`/api/note/${nameId['id']}/`)
        let data = await response.json();
        setModelsNotes(data)  
        console.log('DATA: ',data);
        //console.log('NOTE: ',notes);
    }
    //console.log('NOTE: ',notes);
    //let nameId = match.params.id;
    //console.log(nameId);
    
    //console.log(nameId['id']);
    return (
        <div className="UserCasePage-class" key="UserCasePage-key">
            {model_note_param.map((model_note, index) => (
                <div className="UserCasePage-class-inner" key="UserCasePage-key-inner">
                    <h3 className="id" key={"id"+model_note.id}>Index: {model_note.id}</h3>
                    <h3 className="body" key={"body"+model_note.id}>Body: {model_note.body}</h3>
                    <h3 className="date" key={"date"+model_note.id}>Date: {model_note.date}</h3>
                    <UserCases note={model_note.id} />
                </div>
                
            ))}

        {/*{notes.map((note, index) => (
            <div>
                {console.log(index)}
                <h3 className="body" key={index}>Body: {note.body}</h3>
            </div>
        ))}
        {notes.map((note, index) => (
            <div>
                {console.log(index)}
                <h3 className="date" key={index}>Date: {note.date}</h3>
            </div>
        ))}*/} 
        </div>

    )
}

export default UserCasePage