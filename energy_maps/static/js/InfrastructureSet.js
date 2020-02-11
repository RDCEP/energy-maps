// /**
//  * module description
//  * @module InfrastructureSet
//  */

/** InfrastructureSet description */
module.exports = {

    InfrastructureSet: 
        /** 
         * constructor description
         * @param {[type]} name [description]
         * @param {[type]} value [description]
         * @param {[type]} column [description]
         * @param {[type]} draw [description]
         */
        function InfrastructureSet(name, value, column, draw) {
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
