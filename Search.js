function Search() {}

Search.Save = function (mealList, onSuccess) {
    var document = {'mealList': mealList.toJSON()};
    $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), onSuccess);
};