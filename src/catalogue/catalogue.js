const { CatalogueItem } = require("../models/catalogue_item");
const fs = require('fs');

class Catalogue {
    constructor() {
        this.items = this.populate_catalogue_from_file();
    }

    populate_catalogue_from_file() {
        const items = new Map();
        const item_list = [];
        const catalogue_directory = './data/catalogue/';

        /* Add items from every file in the data/catalogue/ directory */
        fs.readdirSync(catalogue_directory).forEach(file => {
            const path = catalogue_directory + file;
            console.log(path)
            
            const data = fs.readFileSync(path, 'utf8');
            const raw_items = JSON.parse(data);
            for (const raw_item of raw_items) {
                const keywords = [];
                for (const keyword of raw_item.keywords) {
                    keywords.push(keyword.toLowerCase());
                }
                const item = new CatalogueItem(raw_item.id, raw_item.name, raw_item.description, raw_item.base_value, keywords);
                items.set(item.id, item);
                item_list.push(item);
            }
        });

        return items
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
            results = this.filterByBaseValue(results,min,max);
        }

        return results;
    }
    
    filterByIds(candidates,ids) {
        const results = [];
        candidates.forEach((item,key) => {
            if (ids.includes(item.id)) {
                results.push(item);
            }            
        });

        return results;
    }

    filterByName(candidates,name,exact) {
        exact = (exact == 'true');
        const results = [];
        candidates.forEach((item,key) => {
            // console.log(item);
            if (!exact) {
                if (item.name.toLowerCase().includes(name)) {
                    results.push(item);
                }
            } else {
                if (item.name == name) {
                    results.push(item);
                }
            }
        });

        return results;
    }

    filterByKeyword(candidates,keyword) {
        const results = [];
        candidates.forEach((item,key) => {
            if (item.keywords.includes(keyword)) {
                results.push(item);
            }
        });

        return results;
    }

    filterByBaseValue(candidates,min,max) {
        if (min == undefined) {
            min = 0;
        }

        if (max == undefined) {
            max = Number.MAX_VALUE;
        }

        const results = [];
        candidates.forEach((item,key) => {
            const value = item.base_value;
            if (value <= max && value >= min) {
                results.push(item);
            }
        });

        return results;
    }
}

exports.Catalogue = Catalogue;