import React, { Component } from 'react';
import { connect } from "react-redux";
import firestore from "../modules/firestore.js";
import cookie from "react-cookies";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import ItemCard from "./ItemCard.js";

function titleCase(string) {
    if (!string) return "";
    let sentence = string.toLowerCase().split(" ");
    for(let i = 0; i< sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}

function countOccurancesOfX(array) {
    let count = 0
    for (let i in array) {
        if (array[i] === "X") count ++
    }
    return count
}

const PLAIN = {
    background: "white",
    textAlign: "center"
}

const ELIMINATED = {
    background: "gray",
    color: "white",
    textAlign: "center",
    opacity: 0.3
}

// This is a dirty hack but i got lazy and probably will not even add other packs
const CHAMPIONS = require("../assets/champions/champions_datapack.json")

const GAME_VERSIONS = {
  "champions": CHAMPIONS
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        //Set up listener (May need to put this in a promise later)
        firestore.collection("sessions").doc(this.props.session.db_id)
            .onSnapshot({includeMetadataChanges: true}, (doc) => {
                if (doc.exists) {
                    this.props.updateGame(doc.data());
                } else {
                    cookie.remove("log_player");
                    cookie.remove("log_session");
                    this.props.clearGame();
                }
            })
    }

    genBody() {
        switch(this.props.stage) {
            case "lobby":
                return this.lobby();
            case "game":
                return this.game();
            default:
                return null
        }
    }

    genFooter() {
        switch(this.props.stage) {
            case "lobby":
                if (this.props.is_player_1) {
                    return(
                      <Row>
                          <Col>
                              <Button onClick={() => this.startGame()}>Start Game</Button>
                          </Col>
                          {this.props.player_team ?
                              <Col>
                                  <Button variant={this.props.player_team === "red" ? "primary" : "danger"} onClick={() => this.switchTeams()}>Switch Teams</Button>
                              </Col>
                          :null}
                          <Col>
                              <Button onClick={() => {
                                  //End Game
                                  firestore.collection("sessions").doc(this.props.session.db_id).delete()
                              }}>End Game</Button>
                          </Col>
                      </Row>)
                  }
                  break;
            case "game":
                if (this.props.is_player_1) {
                    //HOST ONLY
                    return (<Row>
                        <Col>
                            <Button onClick={() => {
                                firestore.collection("sessions").doc(this.props.session.db_id).update({
                                    stage: "lobby",
                                })
                            }}>
                                Return to Lobby
                            </Button>
                        </Col>
                    </Row>)
                }
                break;
            default:
                return null;
        }
    }

    async startGame() {
        //Start Game

        if (this.props.player_1 === "" ||  this.props.player_2 === "") return null;

        let board = [];
        let possible_items = Object.keys(GAME_VERSIONS[this.props.version])

        while (board.length < 36) {
            let item = possible_items[Math.floor(Math.random()*possible_items.length)];
            if (!board.includes(item)) {
                board.push(item)
            }
        }
        let p1_card = Math.floor(Math.random()*board.length)
        let p2_card = Math.floor(Math.random()*board.length)
        while (p2_card === p1_card) p2_card = Math.floor(Math.random()*board.length)
        firestore.collection("sessions").doc(this.props.session.db_id).update({
            version: this.props.version,
            stage: "game",
            "round.board": board,
            "round.player_1_board": Array(36).fill(""),
            "round.player_2_board": Array(36).fill(""),
            "round.player_1_card": p1_card,
            "round.player_2_card": p2_card,
        })
    }

    getGameVersions() {
        let versions = [];
        for (let v in Object.keys(GAME_VERSIONS)) {
            versions.push(<option key={Object.keys(GAME_VERSIONS)[v]} label={titleCase(Object.keys(GAME_VERSIONS)[v])} value={Object.keys(GAME_VERSIONS)[v]}/>)
        }
        return versions;
    }

    lobby() {
        let lobby = [];
        lobby.push(<Alert variant="info" key="code">{"Room Code: "+this.props.session.key}</Alert>);
        if (this.props.is_player_1) {
            lobby.push(<Row key="mode">
                <Col>
                    <Form.Label>
                        <Alert variant="dark">Game Settings:</Alert>
                    </Form.Label>
                </Col>
                <Col>
                    <Form.Control as="select" value={this.props.version} onChange={(e) => this.props.changeVersion(e.target.value)}>
                        {this.getGameVersions()}
                    </Form.Control>
                </Col>
            </Row>);
        }
        lobby.push(<ListGroup.Item key={"player_1"}>
            {this.props.player_1}
        </ListGroup.Item>)
        lobby.push(<ListGroup.Item key={"player_2"}>
            {this.props.player_2}
        </ListGroup.Item>)
        return lobby;
    }

    game() {
        let game = []
        game.push(<Row key={"scores"}>
            <Col>
                <Alert variant="dark">
                    {"You've Eliminated: " + ((this.props.is_player_1) ? countOccurancesOfX(this.props.round.player_1_board) : countOccurancesOfX(this.props.round.player_2_board))}
                </Alert>
            </Col>
            <Col>
                <Alert variant="dark">
                    {"Your Opponent: " + ((this.props.is_player_1) ? countOccurancesOfX(this.props.round.player_2_board) : countOccurancesOfX(this.props.round.player_1_board))}
                </Alert>
            </Col>
        </Row>);
        game.push(<Row key="board">
            <Col>
                <Table bordered>
                    <tbody>
                        {this.genBoard()}
                    </tbody>
                </Table>
            </Col>
        </Row>)
        game.push(
            <Row key="card">
                <Col>
                    <Alert variant="dark">
                        <ItemCard item={this.props.is_player_1
                            ? GAME_VERSIONS[this.props.version][this.props.round.board[this.props.round.player_1_card]]
                            : GAME_VERSIONS[this.props.version][this.props.round.board[this.props.round.player_2_card]]
                        } />
                    </Alert>
                </Col>
            </Row>
        );
        return game;
    }

    handleCardClick(id) {
        if (this.props.is_player_1) {
            let new_board = this.props.round.player_1_board
            new_board[id] = new_board[id] === "X" ? "" : "X"
            firestore.collection("sessions").doc(this.props.session.db_id).update({
                "round.player_1_board": new_board
            })
        } else {
            let new_board = this.props.round.player_2_board
            new_board[id] = new_board[id] === "X" ? "" : "X"
            firestore.collection("sessions").doc(this.props.session.db_id).update({
                "round.player_2_board": new_board
            })
        }
    }

    genBoard() {
        let rows = []
        for (let r = 0; r < 6; r++) {
            let numbers = [];
            for (let i = 0; i < 6; i++) {
                numbers.push(i);
            }
            let row = <tr key={"r"+r}>
                {numbers.map((c) => {
                    let style = PLAIN;
                    if ((this.props.is_player_1 && this.props.round.player_1_board[r*6 + c] === "X") || (!this.props.is_player_1 && this.props.round.player_2_board[r*6 + c] === "X")) {
                        style = ELIMINATED;
                    }

                    let item = GAME_VERSIONS[this.props.version][this.props.round.board[r*6 + c]]
                    return <td id={r*6 + c} style={style} key={"i"+(r*6 + c)} onClick={() => this.handleCardClick(r*6 + c)}>
                        <ItemCard item={item} style={style} />
                    </td>
                })}
            </tr>
            rows.push(row)
        }
        return rows;
    }

    render() {
        return (
            <div>
                <Card>
                    <Card.Header>
                        {titleCase(this.props.stage)}
                    </Card.Header>
                    <Card.Body>
                        {this.genBody()}
                    </Card.Body>
                    <Card.Footer>
                        {this.genFooter()}
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    session: state.session,
    is_player_1: state.is_player_1,
    version: state.version,
    round: state.round,
    player_1: state.player_1,
    player_2: state.player_2,
    stage: state.stage,
});

const mapDispatchToProps = dispatch => ({
    updateGame: (doc) => dispatch({
        type: "update_game",
        payload: doc
    }),
    clearGame: () => dispatch({
        type: "clear_game",
        payload: null
    }),
    changeVersion: (version) => dispatch({
        type: "set_version",
        payload: version
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
