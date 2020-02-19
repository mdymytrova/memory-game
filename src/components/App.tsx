import React from 'react';
import './App.scss';
import Tile from './Tile';
import './Tile.scss';
import Colors from '../constants/colors.constant';

interface ITile {
    color: string;
    visible: boolean;
    matched?: boolean;
}

interface IState {
    tiles: ITile[];
    colorToCompare: string;
    newOpenColor?: string;
}

class App extends React.Component<{}, IState> {
    private tilesNumber: number;

    constructor(props: object) {
        super(props);
        this.tilesNumber = 16;

        this.state = {
            tiles: this.getTiles(),
            colorToCompare: ''
        }
    }

    private getShuffledColors(): string[] {
        const colors = [...Colors, ...Colors];
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        return colors;
    }

    private getTiles(): ITile[] {
        const colors = this.getShuffledColors();
        return colors.map((color) => {
            return {
                color: color,
                visible: false
            };
        });
    }

    private getBackgroundColor = (tile: ITile) => {
        return {
            backgroundColor: tile.visible ? tile.color : 'grey'
        };
    }

    private onTileClick = (clickedTile: ITile, clickedTileIndex: number): () => void => {
        return () => {
            const { colorToCompare, tiles } = this.state;
            let updatedTiles;
            let updatedColorToCompare;
            if (colorToCompare === '') {
                updatedTiles = tiles.map((tile, index) => {
                    if (clickedTileIndex === index) {
                        tile.visible = true;
                    }
                    return tile;
                });
                updatedColorToCompare = clickedTile.color;
            } else if (colorToCompare === clickedTile.color) {
                updatedTiles = tiles.map((tile, index) => {
                    if (clickedTile.color === tile.color) {
                        tile.visible = true;
                        tile.matched = true;
                    }
                    return tile;
                });
                updatedColorToCompare = '';
            } else {
                updatedTiles = tiles.map((tile, index) => {
                    if (clickedTileIndex === index) {
                        tile.visible = true;
                    }
                    return tile;
                });
                updatedColorToCompare = ''; 
                this.hideAfterTimout(); 
            }
            this.setState({ 
                tiles: updatedTiles,
                colorToCompare: updatedColorToCompare
            });
        }
    }

    private hideAfterTimout = () => {
        setTimeout(() => {
            const { tiles } = this.state;
            const updatedTiles = tiles.map((tile, index) => {
                tile.visible = !!tile.matched;
                return tile;
            }); 
            this.setState({ 
                tiles: updatedTiles
            });
        }, 500);
    }

    private restart = () => {
        this.setState({
            tiles: this.getTiles(),
            colorToCompare: ''
        });
    }

    render(): React.ReactNode {
        const { tiles } = this.state;
        const tilesElements = tiles.map((tile, index) => {
            return(
                <div
                    key={index}
                    className="tile"
                    style={this.getBackgroundColor(tile)}
                    onClick={this.onTileClick(tile, index)}>
                </div>
            );
        });
        return(
            <div className="tiles-container">
                {tilesElements}
                <button onClick={this.restart}>Restart</button>
            </div>
        );
    }
}

export default App;