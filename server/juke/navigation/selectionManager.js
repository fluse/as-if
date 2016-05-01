'use strict';

var buttonMapping = require('./mapping.js');
var Ticker = require('./ticker.js');

class SelectionManager {

    constructor(app, onSelection) {

        this.app = app;
        this.onSelection = onSelection || () => {};
        this.isPaginationActive = false;
        // create validity ticker instance with
        // validity duration and clear callback
        this.ticker = new Ticker(8, this.clear.bind(this));

        this.tickerPagination = new Ticker(0.8, () => {
            console.log('pagination blocking stopped');
            this.isPaginationActive = false;
        });

        this.pressed = {
            first: null,
            second: null
        };
    }

    onInput(buttons) {
        // check pressed button
        for (var button of buttons) {
            var state = button.getState();
            this.checkForPressed(state);
        }

        this.checkForValiditySelection();
    }

    checkForPressed(state) {

        if (state.isPressed) {
            var button = state;

            // check special behavior buttons
            if (button.type === 'pageNext' || button.type === 'pagePrevous') {

                this.pressed.first = button;
                this.pressed.second = null;

                if (!this.isPaginationActive) {
                    this.isPaginationActive = true;
                    this.tickerPagination.start();
                    this.onSelectionEnd();
                }
                return;
            }

            // start reset timer
            if (button.type === 'first') {
                // start validity timer if button first
                this.ticker.abort().start();

                // reset second button if type is first
                this.pressed.second = null;
            }

            // cache button behavior
            this.pressed[button.type] = button;

        }
    }

    checkForValiditySelection() {

        if (this.pressed.first !== null && this.pressed.second !== null) {
            this.onSelectionEnd();
        }
    }

    onSelectionEnd() {
        var firstValue = this.pressed.first.count;
        var secondValue = this.pressed.second !== null ? this.pressed.second.count : 0;
        this.onSelection({
            value: firstValue + secondValue,
            pressed: this.pressed
        });
        this.clear();
    }

    clear() {
        this.ticker.abort();
        this.pressed = {
            first: null,
            second: null
        };
    }
}

module.exports = SelectionManager;
