class CatalogueItem {
    constructor(id,name,description,base_value,keywords) {
        this.id = id;
        this.name = name;
        this.desecription = description;
        this.base_value = base_value + parseInt(Math.random()*50);
        this.keywords = keywords;
    }
}

exports.CatalogueItem = CatalogueItem;