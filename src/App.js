import React, { Component } from 'react';
import { connect } from "react-redux";

import Menu from "./components/Menu.js";
import Game from  "./components/Game.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
              integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
              crossOrigin="anonymous"
            />
            {/*<button onClick={() => this.props.debug()}>DEBUG</button>*/}
            {/*<button onClick={() => this.props.load()}>Load Words</button>*/}
                {this.props.session.key && this.props.session.db_id ?
                    <Game/>
                :
                    <Menu/>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    session: state.session,
});

const mapDispatchToProps = dispatch => ({
    debug: () => dispatch({
        type: "dump_store",
        payload: null
    }),
    load: () => dispatch({
        type: "load_wordlist",
        payload: null
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
