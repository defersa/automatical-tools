var multiOtsu = function( his, levels){
    var tr = [];
    var s = [];
    var W = [];
    var M = [];
    var MK = [];

    var MT = 0;
    var curMax = 0;
    var max = 0;

    for(var i = 0; i <= levels; i++){
        tr[i] = 0;
        s[i] = 0;
        W[i] = 0;
        M[i] = 0;
        MK[i] = 0;
    }
    for(var i = 0; i < 256; i++){
        MT += i*his[i];
    }

    function stepOtsu(level){
        for(; s[level] < 255; s[level]++){
            var i = s[level];
            W[level] += his[i];
            MK[level] += i * his[i];
            M[level] = MK[level] / W[level];

            s[level + 1] = i + 1;
            if (level < levels - 1) {
                MK[level + 1] = 0;
                W[level + 1] = 0;
    
                stepOtsu( level + 1);
            } else {
                var Wsum = 0;
                var MKsum = 0;
    
                for (var k = 0; k < levels; k++) {
                    Wsum += W[k];
                    MKsum += MK[k];
                }
    
                W[level + 1] = 1 - Wsum;
                MK[level + 1] = MT - MKsum;
    
                if (MK[level + 1] <= 0) break;
    
                M[level + 1] = MK[level + 1] / W[level + 1];
    
                curMax = 0;
                for (var k = 0; k < levels + 1; k++) {
                    curMax += W[k] * (M[k] - MT)*(M[k] - MT);
                }
                if (max < curMax) {
                    max = curMax;
                    for (var k = 0; k < levels; k++) {
                        tr[k] = s[k];
                    }
                }
            }
        }
    }

    stepOtsu( 0 );

    return tr;
}

function main(){
    var histo = [ 0, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, 0, 0];

    var sum = 0;

    for(var i = 0; i < 256; i++){
        sum += histo[i];
    }
    for(var i = 0; i < 256; i++){
        histo[i] = histo[i]/sum;
    }
    console.log(sum);
    var th = multiOtsu(histo, 5);
    console.log(th);

}