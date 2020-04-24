Ext.define("Ext.ux.util.Format", {
    Real: function(v) {
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.decimalSeparator = ',';
        var val = '';
        if (v) {
            val = Ext.util.Format.currency(v, 'R$ ', 2, false);
        } else {
            val = 'R$ 0,00';
        }
        return val;
    },
    Value: function(v) {
        var val = '';
        if (v) {
            val = Ext.util.Format.currency(v, ' ', 2, false);
        } else {
            val = 0;
        }
        return val;
    },
    Percent: function(v) {
        var val = '';
        if (v) {
            val = Ext.util.Format.currency(v, ' ', 1, false);
        } else {
            val = 0;
        }
        return val;
    },
    maskCpf: function(value) {
        var str = "" + value;
        var pad = "00000000000";
        var cpf = pad.substring(0, pad.length - str.length) + str;
        return cpf.substr(0, 3) + '.' + cpf.substr(3, 3) + '.' + cpf.substr(6, 3) + '-' + cpf.substr(9, 2);
    },
    maskCnpj: function(value) {
        var str = "" + value;
        var pad = "00000000000000";
        var cnpj = pad.substring(0, pad.length - str.length) + str;
        return cnpj.substr(0, 2) + '.' + cnpj.substr(2, 3) + '.' + cnpj.substr(5, 3) + '/' + cnpj.substr(8, 4) + '-' + cnpj.substr(12, 2);
    },
    formatCellLigacoes: function(value) {

        if (value === 'N' || value === 'F') {
            return 'x-grid-cell-red-border';
        } else if (value === 'O') {
            return 'x-grid-cell-yellow-border';
        } else if (value === 'A') {
            return 'x-grid-cell-green-border';
        }

        return '';
    },
    formatCellGrid: function(value) {

        if (value >= 100)
            return 'x-grid-cell-green';
        if (value >= 80 && value < 100)
            return 'x-grid-cell-yellow';
        if (value < 80) {
            return 'x-grid-cell-red';
        }

        return '';
    },
    formatCellValue: function(value){
        var cls = '';

        if(value > 0)
            cls = 'x-grid-cell-text-green';
        if(value < 0)
            cls = 'x-grid-cell-text-red';

        return cls;
    },
    Time: function (v) {
        var seconds;
        var minutes;
        var hours;
        var days;
        var time = '';
        var sing = '';

        // Find minutes
        seconds = Number(v);
        if (seconds < 0) {
            sing = '-';
        }

        console.log('S: '+seconds);
        minutes = parseInt((Math.abs(seconds)) / 60);
        console.log('M: '+minutes);

        // Find hours
        if (minutes >= 60) {
            hours = parseInt(minutes / 60);
            minutes = minutes % 60;

            // Find days
            if (hours >= 24) {
                days = parseInt(hours / 24);
                hours = hours % 24;
                
                time += days + ' d';
            }
        }

        time += (time.length>0?', ':'');
        time += sing + (hours>0?hours+' h e ':'') + minutes + ' min';

        return time;
    }
//    Time: function (v, vf) {
//        var seconds;
//        var minutes;
//        var hours;
//        var days;
//        var time = '';
//        var sing = '';
//
////        console.log(v+' - '+vf);
//        // Find minutes
//        seconds = Number(v) - Number(vf);
//        
//        if (seconds < 0) {
//            sing = '-';
//        }
//
//        minutes = parseInt((Math.abs(seconds)) / 60);
//
//        // Find hours
//        if (minutes >= 60) {
//            hours = parseInt(minutes / 60);
//            minutes = minutes % 60;
//
//            // Find days
//            if (hours >= 24) {
//                days = parseInt(hours / 24);
//                hours = hours % 24;
//                
//                time += days + ' d';
//            }
//        }
//
//        time += (time.length>0?', ':'');
//        time += sing + (hours>0?hours+' h e ':'') + minutes + ' min';
//
//        return time;
//    }
});