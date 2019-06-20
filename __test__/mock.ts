HTMLElement.prototype.insertAdjacentElement = <any>jest.fn((position:string, element:HTMLElement)=>{
    console.log(this, 'this')
});