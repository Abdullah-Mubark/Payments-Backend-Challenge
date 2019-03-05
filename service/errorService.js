var view_path = '../templates';
function showErrorPage(data, response, field, validationType, status){
    var responseData = {
        "cause": data.error.cause,
        "explanation": data.error.explanation,
        "field": field,
        "validationType": validationType,
        "status": status
    };
    response.render(view_path + '/error', responseData);
}
module.exports = {
    showErrorPage: showErrorPage, 
}