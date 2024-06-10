
import SideManager from "./sidemanager";

class NeutralManager extends SideManager {
    constructor() {
        super();
        this.increasePopulation = this.increasePopulation.bind(this);
        this.popTaskId = setInterval(this.increasePopulation, settings.neutral_pop_rate);
    }   

    /**
     * @override from SideManager
     */
    update() {
        //TODO
    }

    increasePopulation() { 
        this.cities.forEach(city => {
            if (city.pop < settings.max_pop) city.incrementPop();
        }); 
    }


}
