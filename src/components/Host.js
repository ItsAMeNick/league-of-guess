import React, { Component } from 'react';
import { connect } from "react-redux";
import firestore from "../modules/firestore.js";
import cookie from "react-cookies";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const VALID_CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZ98765432"

class Host extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player_name: "",
            error_message: ""
        };
    }

    hostGame() {
        if (this.state.player_name) {
            let key = VALID_CHARS[Math.floor(Math.random()*VALID_CHARS.length)] + VALID_CHARS[Math.floor(Math.random()*VALID_CHARS.length)] + VALID_CHARS[Math.floor(Math.random()*VALID_CHARS.length)] + VALID_CHARS[Math.floor(Math.random()*VALID_CHARS.length)]
            firestore.collection("sessions").add({
                player_1: this.state.player_name,
                player_2: "",
                key: key,
                stage: "lobby",
                version: "",
                game: {
                  player_1_card: "",
                  player_2_card: "",
                  board: [],
                  player_1_board: [],
                  player_2_board: [],
                },
                status: {
                    p1: "",
                    p2: ""
                }
            }).then(ref => {
                this.props.setSession(key, ref.id)
                this.props.setPlayer(this.state.player_name);
                cookie.save("log_session", {key: key, db_id: ref.id})
                cookie.save("log_player", this.state.player_name)
            })
        } else {
            this.setState({error_message: "Enter a Name!"})
        }
    }

    render() {
        return (
            <div>
                {this.state.error_message ?
                    <Row><Col>
                        <Alert variant="danger">
                            {this.state.error_message}
                        </Alert>
                    </Col></Row>
                : null}
                <Row>
                    <Col>
                        <Form.Label> Player Name: </Form.Label>
                    </Col>
                    <Col>
                        <Form.Control onChange={(e) => this.setState({player_name: e.target.value})}/>
                    </Col>
                </Row>
                <Row>
                    <Button onClick={() => this.hostGame()}>
                        Host Game
                    </Button>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    setSession: (key, db_id) => dispatch({
        type: "set_session",
        payload: {
            key: key,
            db_id: db_id
        }
    }),
    setPlayer: (name) => dispatch({
        type: "set_host",
        payload: name
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Host);
