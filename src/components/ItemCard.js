import React, { Component } from 'react';


function titleCase(string) {
    if (!string) return "";
    let sentence = string.toLowerCase().split(" ");
    for(let i = 0; i< sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}

class ItemCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src={require("./../assets/"+this.props.item.image)} />
                <strong>{titleCase(this.props.item.name)}</strong>
            </div>
        );
    }
}

export default ItemCard;
