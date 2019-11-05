import React from 'react';

function Square(props) {
    const { squaresWin, index, onClick, value } = props;
    let classes = `square`;
    if (squaresWin && index) {
        const win = squaresWin.indexOf(index) !== -1 ? 'win' : null
        classes = `square ${win} ${value}`;
    }
    return (
        <button type="button" className={classes} onClick={onClick}>
            {value}
        </button>
    );
}

export default Square;