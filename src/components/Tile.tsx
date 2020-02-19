import React from 'react';
import './Tile.scss';

interface ITileProps {
    color: string;
    onTileClick: any;
} 
class Tile extends React.Component<ITileProps, {}> {

    constructor(props: ITileProps) {
        super(props);
    }

    private getColor = () => {
        return {
            backgroundColor: this.props.color
        };
    }

    private onClickHandler = () => {
        this.props.onTileClick(this.props.color);
    }

    render() {
        return(
            <div
                className="tile"
                style={this.getColor()}
                onClick={this.onClickHandler}>
            </div>
        );
    }
}

export default Tile;