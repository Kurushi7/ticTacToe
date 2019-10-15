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
        console.log(col, row);
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

    //Renders React element ...
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();


        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} onClick={this.handleClick} cells={[0, 1, 2, 3, 4, 5, 6, 7, 8]}/>
                </div>
                <div className="game-info">
                    <Status squares={squares} xIsNext={this.state.xIsNext}/>
                    {/*<Moves history={ this.state.history } stepNumber={ this.state.stepNumber } onClick={this.jumpTo} />*/}
                </div>
            </div>
        );
    }
}

// //Render the application
// ReactDOM.render(
//     <Game />,
//     document.getElementById('root')
// );


/**
 * Scan the entire "squares" array to see if any of the
 * symbols are aligned in a winning combination.
 * (In case of winning, return the symbol)
 **/
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game;
