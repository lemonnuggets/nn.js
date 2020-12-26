class Matrix{
    
    constructor(m, n){
        if(!isNaN(m)){
            this.m = m;
            this.n = n;
            this.data = new Array(m);
            for(let i = 0; i < this.m; i++){
                this.data[i] = new Array(this.n);
            }   
            this.randomize();
        }else{
            this.m = m.m;
            this.n = m.n;
            this.data = m.data;
        }
    }
    
    toArray(){
        if(this.n != 1){
            console.log("Matrices cannot be made into an array")
        }else{
            let abc = [];
            for(let i = 0; i < this.m; i++){
                abc.push(this.data[i][0]);
            }
            return abc;
        }
    }
    
    equateToArray(a){
        if(this.n == 1){
            for(let i = 0; i < this.m - 1; i++){
                this.data[i][0] = a[i];
            }
        }else{
            console.log("Matrix cannot be equated to array");
        }
    }
    
    equateToArrayC(a){
        if(this.n == 1){
            for(let i = 0; i < this.m; i++){
                this.data[i][0] = a[i];
            }
        }else{
            console.log("Matrix cannot be equated to array");
        }
    }
    
    equateToMatrix(other){
        if(this.m == other.m && this.n == other.n){
            for(let i = 0; i < this.m; i++){
                for(let j = 0; j < this.n; j++){
                    this.data[i][j] = other.data[i][j];
                }
            }
        }else{
            console.log("Matrices cannot be equated")
        }
    }
    
    normalize(){
        this.map(this.sigmoid);
    }

    randomize(){
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){                
                this.data[i][j] = Math.random() * 2 -1;
            }
        }        
    }
    
    static transpose(a){
        let tMatrix = new Matrix(a.n, a.m);
        for(let i = 0; i < a.m; i++){
            for(let j = 0; j < a.n; j++){
                tMatrix.data[j][i] = a.data[i][j];
            }
        }
        return tMatrix;
    }
    
    hadamardProduct(other){
        if(this.m != other.m || this.n != other.n){
            console.log("Matrices are of unequal dimension")
        }else{
            for(let i = 0; i < this.m; i++){
                for(let j = 0; j < this.n; j++){
                    this.data[i][j] *= other.data[i][j];
                }
            }
        }
    }
    
    show(){
        console.table(this.data);
    }
    
    multiply(b){
        if(!isNaN(b)){                //b is scalar.
            for(let i = 0; i < this.m; i++){
                for(let j = 0; j < this.n; j++){    
                    this.data[i][j] *= b;
                }
            }                
        }
        else{                                  //b is Matrix,
            if(this.n != b.m){
                console.log("Matrices cannot be multiplied");
            }
            else{
                let result = new Matrix(this.m, b.n);
                if(result.m != this.m || result.n != this.n){
                    console.log("Product cannot be assigned to matrix as product matrix isnt of same dimensions.");                    
                }
                for(let i = 0; i < result.m; i++){
                    for(let j = 0; j < result.n; j++){
                        let sum = 0;
                        for(let k = 0; k < this.n; k++){
                            sum += this.data[i][k] * b.data[k][j];
                        }
                        result.data[i][j] = sum;
                    }
                }
                for(let i = 0; i < result.m; i++){
                    for(let j = 0; j < result.n; j++){
                        this.data[i][j] = result.data[i][j];
                    }
                }
                return result;
            }
        }
    }
    
    static multiply(a, b){        
        if(!isNaN(b)){                //b is scalar.
            for(let i = 0; i < a.m; i++){
                for(let j = 0; j < a.n; j++){    
                    a.data[i][j] *= b;
                }
            }                
        }
        else{                                  //b is Matrix,
            if(a.n != b.m){
                console.log(a, b, "Matrices cannot be multiplied");
            }
            else{
                
                let result = new Matrix(a.m, b.n);
                for(let i = 0; i < result.m; i++){
                    for(let j = 0; j < result.n; j++){
                        let sum = 0;
                        for(let k = 0; k < a.n; k++){
                            sum += a.data[i][k] * b.data[k][j];
                        }
                        result.data[i][j] = sum;
                    }
                }
                return result;
            }
        }        
    }
    
    map(func){
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){
                this.data[i][j] = func(this.data[i][j]);
            }
        }        
    }
    
    static map(matrix, func){
        let n = new Matrix(matrix.m, matrix.n);
        for(let i = 0; i < matrix.m; i++){
            for(let j = 0; j < matrix.n; j++){
                n.data[i][j] = func(matrix.data[i][j]);
            }
        } 
        return n;
    }
    
    sigmoid(x){
        return 1/(1 + Math.exp(-x));    
    }
    
    dsigmoid(x){ //x should be passed through sigmoid first
        return x * (1 - x)
    }
    
    add(b){
        if(b.m != this.m || b.n != this.n){
            console.log("Matrices cannot be added");
            return 0;
        }
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){                
                this.data[i][j] += b.data[i][j];
            }
        }          
    }
    
    static subtract(a, b){
        if(b.m != a.m || b.n != a.n){
            console.log("Matrices cannot be subtracted");
            return 0;
        }
        for(let i = 0; i < a.m; i++){
            for(let j = 0; j < a.n; j++){                
                a.data[i][j] -= b.data[i][j];
            }
        }
        return a;
    } 
    
    subtract(b){
        if(b.m != this.m || b.n != this.n){
            console.log("Matrices cannot be subtracted");
            return 0;
        }
        for(let i = 0; i < this.m; i++){
            for(let j = 0; j < this.n; j++){                
                this.data[i][j] -= b.data[i][j];
            }
        }          
    }        
    
}