import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom'

const ListItem = ({ model_note_param }) => {
    function changeBackground_over_div1(e) {
        e.target.style.background = '#1aff8c';
    }
    function changeBackground_out_div1(e) {
        e.target.style.background = 'white';
    }
    function changeBackground_over_div2(e) {
        e.target.style.background = '#66ffb3';
    }
    function changeBackground_out_div2(e) {
        e.target.style.background = 'white';
    }
    function changeBackground_over_h(e) {
        e.target.style.background = '#b3ffd9';
    }
    function changeBackground_out_h(e) {
        e.target.style.background = 'white';
    }
  return (
        <Col>
            <Link to={`/note/${model_note_param.id}`} style={{ textDecoration: 'none' }}>
                <div className="border p-5" onMouseEnter={changeBackground_over_div1} onMouseLeave={changeBackground_out_div1}>
                    <div className="p-4 center-block" onMouseOver={changeBackground_over_h} onMouseOut={changeBackground_out_h}>
                        {/*<h3 style={{ color: '#008060' }} className="p-3" align="center" onMouseOver={changeBackground_over_h} onMouseOut={changeBackground_out_h}>{note.body}</h3>*/}
                        <h3 style={{ color: '#008060' }} className="p-2" align="center">{model_note_param.body}</h3>
                    </div>
                    
                </div>


            {/*<div>
                <h2>ListItem</h2>
                <Link to='/note/1/'>
                    <h3>Link 1</h3>
                </Link>
                <Link to='/note/2/'>
                    <h3>Link 2</h3>
                </Link>
            </div>*/}
            </Link>
        </Col>
  )
}

export default ListItem