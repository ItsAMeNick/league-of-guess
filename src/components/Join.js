import React, { Component } from 'react';
import { connect } from "react-redux";
import firestore from "../modules/firestore.js";
import cookie from "react-cookies";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player_name: "",
            session_key: "",
            error_message: ""
        };
    }

    joinGame() {
        if (this.state.player_name) {
            if (this.state.session_key) {
                firestore.collection("sessions").where("key", "==", this.state.session_key.toUpperCase()).get().then(resp => {
                    if (resp.docs.length === 1) {
                        if (resp.docs[0].data().stage !== "lobby") {
                            this.setState({error_message: "Please wait for the current round to finish before attempting to join."})
                        } else if (resp.docs[0].data().player_1 === this.state.player_name) {
                            this.setState({error_message: "Player name is unavaliable."})
                        } else {
                            firestore.collection("sessions").doc(resp.docs[0].id).update({
                                player_2: this.state.player_name
                            })
                            this.props.setSession(resp.docs[0].data().key, resp.docs[0].id);
                            this.props.setPlayer(this.state.player_name);
                            cookie.save("log_session", {key: resp.docs[0].data().key, db_id: resp.docs[0].id})
                            cookie.save("log_player", this.state.player_name)
                        }
                    } else {
                        this.setState({error_message: "Session key does not exist."})
                    }
                })
            } else {
                this.setState({error_message: "Enter a session key."})
            }
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
                        <Form.Label> Session Key: </Form.Label>
                    </Col>
                    <Col>
                        <Form.Control onChange={(e) => this.setState({session_key: e.target.value})}/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <Form.Label> Player Name: </Form.Label>
                    </Col>
                    <Col>
                        <Form.Control onChange={(e) => this.setState({player_name: e.target.value})}/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Button onClick={() => this.joinGame()}>
                        Join Game
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
        type: "set_player",
        payload: name
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Join);
