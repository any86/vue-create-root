Element.prototype.insertAdjacentElement = function(position:string, element:HTMLElement){
    this.appendChild(element)
    return element;
}


// Element.prototype.insertAdjacentElement = function (position: string, element: HTMLElement) {
//     const container = this;
//     jest.fn().mockImplementation(function (position: string, element: HTMLElement) {
//         // container.appendChild(element);
//     });
//     return element
// }



window.alert = jest.fn().mockImplementation(query => {
    return {
        query
    };
});