const { Item } = require("../models/item");
const crypto = require("crypto");
/**
 * An inventory is the current selection of items on sale.
 */
class Inventory {
    constructor(catalogue) {
        this.items = new Map();
        this.populate_inventory(catalogue);
    }

    populate_inventory(catalogue) {
        const keys = catalogue.items.keys();
        let running_count = 0;
        for (const key of keys) {
            const type = catalogue.items.get(key);
            const number_to_add = parseInt(Math.floor(Math.random() * 10));
            for (let i = 0; i < number_to_add; i++) {
                let id = crypto.randomBytes(20).toString('hex');
                const price = type.base_value + parseInt(Math.random()*20);
                const item = new Item(type,id,price);
                this.items.set(id,item);
                running_count++;
            }
        }
    }

    getByName(name,exact) {
        return this.filterByName(this.items,name,exact);
    }

    filterByName(candidates,name,exact) {
        exact = (exact == 'true');
        const results = [];
        candidates.forEach((item,key) => {
            // console.log(item);
            if (!exact) {
                if (item.info.name.toLowerCase().includes(name)) {
                    results.push(item);
                }
            } else {
                if (item.info.name == name) {
                    results.push(item);
                }
            }
        });

        return results;
    }

    getByKeyword(keyword) {
        return this.filterByKeyword(this.items,keyword);
    }

    filterByKeyword(candidates,keyword) {
        const results = [];
        candidates.forEach((item,key) => {
            if (item.info.keywords.includes(keyword)) {
                results.push(item);
            }
        });

        return results;
    }

    getByValue(min,max) {
        return this.filterByValue(this.items,min,max);
    }

    filterByValue(candidates,min,max) {
        if (min == undefined) {
            min = 0;
        }

        if (max == undefined) {
            max = Number.MAX_VALUE;
        }

        const results = [];
        candidates.forEach((item,key) => {
            const cost = item.price;
            if (cost <= max && cost >= min) {
                results.push(item);
            }
        });

        return results;
    }

    search(params) {
        const name = params.name;
        const exact = params.exact;
        const keyword = params.keyword;
        const min = params.minValue;
        const max = params.maxValue;
        let results = this.items;

        if (name != undefined) {
            results = this.filterByName(results,name,exact);
        }

        if (keyword != undefined) {
            results = this.filterByKeyword(results,keyword);
        }

        if (min != undefined || max != undefined) {
            results = this.filterByValue(results,min,max);
        }

        return results;
    }
}

exports.Inventory = Inventory;