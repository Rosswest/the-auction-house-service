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

    search(search_params) {
        return ["TODO"];
    }

}

exports.Catalogue = Catalogue;