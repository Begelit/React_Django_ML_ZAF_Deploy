import React, {useState, useEffect} from 'react'
import ListItem from '../components/ListItem';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserCasesListPage() {

    let [models_notes, setModelsNotes] = useState([]);

    useEffect(()=>{
        getModelsNotes();
    },[]);

    let getModelsNotes = async() => {
        let response = await fetch('/api/note/')
        let data = await response.json();
        setModelsNotes(data)
        console.log('DATA: ',data);
    }

    return (

    <div className="p-5">
        <Container>
            <Row>
                <div className="p-3"></div>
            </Row>
            <Row>
                    {models_notes.map((model_note, index) => (
                        <ListItem key={index} model_note_param={model_note} />
                    ))}
                    {/*notes.map((note, index) => (
                        <h3 key={index}>{note.body}</h3>
                    ))*/}
            </Row>
        </Container>
    </div>
    )
}

export default UserCasesListPage