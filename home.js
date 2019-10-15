import React, {Component} from 'react';
import axios from 'axios';
import './game.css';

const array = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
const Square = props => {
    const {value, ...other} = props;
    console.log(value);
    //Renders React element ...
    return (
        <button className={'square ' + value} onClick={() => other.onClick()}>{value}</button>
    );
};



const Board = props => {
    const {cells, squares, ...other} = props,
        ArrRows = [0, 1, 2];
    let counter = 1;

    //Renders React element ...
    return (
        <div className="board"> {
            ArrRows.map((row) =>
                <div key={row.toString()} className="board-row">
                    {
                        cells.slice(row * 3, counter++ * 3).map((cellID) =>
                            <Square key={cellID.toString()} value={squares[cellID]}
                                    onClick={() => other.onClick(cellID)}/>
                        )
                    }
                </div>
            )
        }
        </div>
    );
};



const Status = props => {
    const {squares, xIsNext} = props,
        winner = calculateWinner(squares),
        effect = winner ? 'bounce' : '';
    let status;

    if (winner) {
        status = 'Winner is: ' + winner;
    } else {
        status = 'Next player is: ' + (xIsNext ? 'x' : 'o');
    }

    //Renders React element ...
    return (
        <div className="game-info__status">
            <div className={'status ' + effect}>{status}</div>
        </div>
    );
};

class Game extends Component {
    //Setup component initial state values and bind methods
    constructor(props) {
        super(props); //Access parent functions
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                //Help calculate the col and row where the latest click happened
                clickIndex: null
            }],
            xIsNext: true,
            stepNumber: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.jumpTo = this.jumpTo.bind(this);
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const col = Math.floor(this.state.stepNumber % 3), row = Math.floor(this.state.stepNumber / 3);
        console.log(i);
        axios.post('http://127.0.0.1:8000/api/insertMove', {
            row: row,
            column: col,
            mark: 'X',
            size: 3,
            new: false
        });
        squares[i] = this.state.xIsNext ? 'x' : 'o';
        this.setState({
            history: history.concat([{squares: squares, clickIndex: i}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });


        axios.post('http://127.0.0.1:8000/api/getNextMove', {
            opponentSign: 'O',
            computerSign: 'X',
            size: 3,
            array: array
        });
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'x' : 'o';
        this.setState({
            history: history.concat([{squares: squares, clickIndex: i}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    createarray(rowCount, colCount) {
        const myarr = [];
        for (var i = 0; i < rowCount; i++) {
            const row = [];
            for (var j = 0; j < colCount; j++) {
                const col = "";
                row.push(col);
            }
            myarr.push(row);
        }
        return myarr;
    };

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });

        const cellData = axios.post('http://127.0.0.1/8000/api/getNextMove', {
            opponentSign: 'X',
            computerSign: 'O',
            size: 3,
        });
        console.log('adhsddsd');
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();


        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} onClick={this.handleClick} cells={array}/>
                </div>
                <div className="game-info">
                    <Status squares={squares} xIsNext={this.state.xIsNext}/>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    //call the api
    return null;
}

export default Game;
