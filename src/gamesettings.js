/**
 * This file contains constants representing most of the important game settings. 
 */


var settings = {

    /** @type {integer} - the handle logic and make decisions */
    side_update_rate: 1000, //ms

    /** @type {integer} - the rate at which population is released when moving */
    pop_rate: 150, //ms

    /** @type {integer} - the default population of starting neutral cities */
    default_pop: 10,

    /** @type {integer} - the maximum population of cities. Cities can exceed this population be receiving pop from another city but not by natural growth */
    max_pop: 100,

    /** @type {integer} */
    neutral_max_pop: 40,

    /** @type {integer} - the population gain rate for player cities */
    player_pop_rate: 500, //ms

    /** @type {integer} - the population gain rate for neutral cities */
    neutral_pop_rate: 1000, //ms

    /** @type {integer} - the population gain rate for enemy cities */
    enemy_pop_rate: 400, //ms

    /** @type {number} */
    ai_decision_rate: .2, // fractional probability of the ai choosing to attack on any given update
}



export default settings;