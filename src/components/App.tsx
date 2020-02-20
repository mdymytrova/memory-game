import React from 'react';
import './App.scss';
import ColorsConstant from '../constants/colors.constant';
import Helper from '../helper';

interface ITile {
    color: string;
    visible: boolean;
    matched?: boolean;
}

interface IState {
    tiles: ITile[];
    colorToCompare: string;
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

    private getTiles(): ITile[] {
        const colors = Helper.shuffle([...ColorsConstant.colors, ...ColorsConstant.colors]);
        return colors.map((color) => {
            return { color, visible: false };
        });
    }

    private getBackgroundColor = (tile: ITile) => {
        const color = tile.matched ? ColorsConstant.disabled : tile.color;
        return {
            backgroundColor: tile.visible ? color : ColorsConstant.default
        };
    }

    private onTileClick = (clickedTile: ITile, clickedTileIndex: number): () => void => {
        return () => {
            if (!clickedTile.visible) {
                const { tiles, colorToCompare } = this.getUpdatedState(clickedTile, clickedTileIndex);
                this.setState({ tiles, colorToCompare });
            }
        }
    }

    private getUpdatedState(clickedTile: ITile, clickedTileIndex: number): IState {
        const { colorToCompare } = this.state;
        const colorToAssign = colorToCompare === '' ? clickedTile.color : '';

        return colorToCompare !== clickedTile.color
            ? this.getDifferentColorState(clickedTileIndex, colorToAssign)
            : this.getMatchedColorState(clickedTile.color);
    }

    private getDifferentColorState(clickedTileIndex: number, colorToAssign: string): IState {
        const tiles = this.getTilesWithUpdatedVisibility(clickedTileIndex);
        if (colorToAssign === '') {
            this.resetColorsAfterTimeout();
        }
        return { tiles, colorToCompare: colorToAssign };
    }

    private getMatchedColorState(clickedTileColor: string): IState {
        const { tiles: oldTiles } = this.state;
        const matchedIndexes: number[] = [];
        const tiles = oldTiles.map((tile, index) => {
            if (clickedTileColor === tile.color) {
                matchedIndexes.push(index);
                tile.visible = true;
            }
            return tile;
        });
        const colorToCompare = '';
        this.resetColorsAfterTimeout(matchedIndexes);
        return { tiles, colorToCompare };
    }

    private getTilesWithUpdatedVisibility(clickedTileIndex: number): ITile[] {
        const { tiles } = this.state;
        return tiles.map((tile, index) => {
            return clickedTileIndex === index ? {...tile, visible: true} : tile;
        });
    }

    private resetColorsAfterTimeout = (matchedIndexes?: number[]): void => {
        setTimeout(() => {
            const updatedTiles = this.getUpdatedTilesAfterTimeout(matchedIndexes);
            this.setState({ tiles: updatedTiles });
        }, 500);
    }

    private getUpdatedTilesAfterTimeout = (matchedIndexes?: number[]) => {
        const { tiles } = this.state;
        return matchedIndexes
            ? tiles.map((tile, index) => matchedIndexes.indexOf(index) >= 0 ? {...tile, matched: true} : tile)
            : tiles.map((tile) => ({...tile, visible: !!tile.matched}));  
    }

    private restart = (): void => {
        this.setState({
            tiles: this.getTiles(),
            colorToCompare: ''
        });
    }

    render(): React.ReactNode {
        const { tiles } = this.state;
        return(
            <div className="container">
                <div className="tiles-container">
                    {tiles.map((tile, index) => (
                        <div
                            key={index}
                            className="tile"
                            style={this.getBackgroundColor(tile)}
                            onClick={this.onTileClick(tile, index)}>
                        </div>
                    ))}
                </div>
                <button onClick={this.restart}>Restart</button>
            </div>
        );
    }
}

export default App;