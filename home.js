import React, {Component} from 'react';
import axios from 'axios';
import './game.css';

const array = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const Square = props => {
    const {value, ...other} = props;

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
            cells.map((row) =>
                <div key={row.index} className="board-row">
                    {
                        row.map((cellID) =>
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
    const {history, squares, xIsNext} = props;
    const moves = history.map((step, move) => {
        const clickIndex = step.clickIndex;
        const col = Math.floor(clickIndex % 3), row = Math.floor(clickIndex / 3);
        console.log(col, row);
    });
    const winner = calculateWinner(squares),
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

const Moves = props => {
    const {history, stepNumber, ...other} = props;
    const moves = history.map((step, move) => {
        const clickIndex = step.clickIndex;
        const col = Math.floor(clickIndex % 3), row = Math.floor(clickIndex / 3);

        const btn_highlight = (stepNumber === move) ? 'btn-primary' : 'btn-secondary';
        const desc = '';
        return (
            <li key={move}>
                <button className={"btn " + btn_highlight + " btn-block"}
                        onClick={() => other.onClick(move)}>{desc}</button>
            </li>
        );
    });

    //Renders React element ...
    return (
        <div className="game-info__moves">
            <ol className="list-moves list-unstyled">
                {moves}
            </ol>
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
        axios.post('http://127.0.0.1:8000/api/insertMove', {
            row: row,
            column: col,
            mark: 'X',
            size: 3,
            new: false
        });
        squares[i] = this.state.xIsNext ? 'x' : 'o';
        this.setState({
            history: [{squares: squares, clickIndex: i}],
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
            history: [{squares: squares, clickIndex: i}],
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

    //Renders React element ...
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();


        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} onClick={this.handleClick} cells={this.createarray(3, 3)}/>
                </div>
                <div className="game-info">
                    <Status history={this.state.history} squares={squares} xIsNext={this.state.xIsNext}/>
                    {/*<Moves history={ this.state.history } stepNumber={ this.state.stepNumber } onClick={this.jumpTo} />*/}
                </div>
            </div>
        );
    }
}


export default Game;
