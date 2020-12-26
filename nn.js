class NeuralNetwork{
    
    constructor(in_, hn_, on_, lr_){
        
        this.input_nodes = new Matrix(in_ + 1, 1);
        this.output_nodes = new Matrix(on_, 1);        
        this.hidden_nodes = new Matrix(hn_ + 1, 1);
        
        this.ih_weights = new Matrix(hn_ + 1,in_ + 1);
        this.ho_weights = new Matrix(on_, hn_ + 1);
        
        this.input_nodes.data[in_]= [1];

        this.hidden_nodes.data[hn_][0] = 1; 
        
        this.lr = lr_;
    }
    
    showNodes(canvas, arr, x, y, size){
        let radius = size / 2;
        for(let i = 0; i < arr.length; i++){
            push();
            canvas.strokeWeight(0.1 * radius);
            canvas.fill(arr[i][0] * 255);
            canvas.stroke(0);
            canvas.ellipse(x + radius, y + radius / 2 + (size * i), radius, radius);
            pop();
        }
    }
    
    showWeights(canvas, arr, ra1, ra2, x1, y1, x2, y2, size){
        let radius = size / 2;
        for(let i = 0; i < ra1.length; i++){
            for(let j = 0; j < ra2.length; j++){
                push();
                canvas.stroke(arr[j][i] * 255);
                //(a, b) to (c, d)
                let a = x1 + radius;
                let b = y1 + radius / 2 + (size * i);
                
                let c = x2 + radius;
                let d = y2 + radius / 2 + (size * j);
                
                canvas.line(a, b, c, d);
                pop();
            }
        }
    }
    
    show(w, h, sf){
        let max = Math.max(this.hidden_nodes.m, this.input_nodes.m, this.output_nodes.m);
        //General Setup of canvas
        let width = w/sf;
        let height = h/sf;
        let bottomCorner = createGraphics(width, height);
        bottomCorner.background(100, 255, 100, 100);
        
        //SHOW INPUT NODES 
        let size = height / max; 
        let startWI = size / 4;
        let startHI = (height / 2) - (this.input_nodes.m / 2) * size + size / 4;
        this.showNodes(bottomCorner, this.input_nodes.data, startWI, startHI, size);
        
        //SHOW HIDDEN NODES
        let startWH = width / 2 - size / 4;
        let startHH = (height / 2) - (this.hidden_nodes.m / 2) * size + size / 4;
        this.showNodes(bottomCorner, this.hidden_nodes.data, startWH, startHH, size);
        this.showWeights(bottomCorner, this.ih_weights.data, this.input_nodes.data, this.hidden_nodes.data, startWI, startHI, startWH, startHH, size);
        
        //SHOW OUTPUT NODES
        let startWO = width - size;
        let startHO = (height / 2) - (this.output_nodes.m / 2) * size + size / 4;
        this.showNodes(bottomCorner, this.output_nodes.data, startWO, startHO, size);
        this.showWeights(bottomCorner, this.ho_weights.data, this.hidden_nodes.data, this.output_nodes.data, startWH, startHH, startWO, startHO, size);       
        
        
        //Draw Canvas
        image(bottomCorner, 0, h - height);
        
    }
    
    feedforward(ra){
        this.input_nodes.equateToArray(ra);
        
        this.hidden_nodes.equateToMatrix(Matrix.multiply(this.ih_weights, this.input_nodes));
        this.hidden_nodes.normalize();
        
        this.output_nodes.equateToMatrix(Matrix.multiply(this.ho_weights, this.hidden_nodes));        
        this.output_nodes.normalize();
        
        return this.output_nodes.toArray();
    }
    
    train(inputs, targets){
        let output = this.feedforward(inputs);
        let outputError = new Matrix(output.length, 1);
        let targetMatrix = new Matrix(output.length, 1);        
        targetMatrix.equateToArrayC(targets);
        
        outputError.equateToArrayC(output);
        targetMatrix.subtract(outputError);
        outputError.equateToMatrix(targetMatrix);
        
        let whoT = new Matrix(Matrix.transpose(this.ho_weights));
        let hiddenError = new Matrix(Matrix.multiply(whoT, outputError));
        
        let gradientO = new Matrix(output.length, 1);
        gradientO.equateToArrayC(output);
        gradientO.map(gradientO.dsigmoid);
        outputError.hadamardProduct(gradientO);
        outputError.multiply(this.lr);
        this.ho_weights.add(Matrix.multiply(outputError, Matrix.transpose(this.hidden_nodes)));
        
        let gradientH = new Matrix(this.hidden_nodes);
        gradientH.map(gradientH.dsigmoid);
        hiddenError.hadamardProduct(gradientH);
        hiddenError.multiply(this.lr);        
        this.ih_weights.add(Matrix.multiply(hiddenError, Matrix.transpose(this.input_nodes)));
    }
}