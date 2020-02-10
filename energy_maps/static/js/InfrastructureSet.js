let InfSet = module.exports = {

    InfrastructureSet: function InfrastructureSet(name, value, column, draw) {
        this.name = name || '';
        this.value = value || 0;
        this.column = column || '';
        this.draw = draw || [{
            f: '',
            src: '',
            w: ''
        }];
    }

}

// let InfrastructureSet = InfSet.InfrastructureSet;

// let inf = new InfrastructureSet('inf', 100, 'class-attr');
// console.log(inf);
