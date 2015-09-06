var CaloricIntakeModel = Backbone.Model.extend({
    defaults: {
        sex: 'Male',
        age: 20,
        height: 180,
        weight: 80,
        bodyType: 'Mesomorph',
        dietTarget: 'Mass loss',
        weightTrainingAverageTime: 90,
        weightTrainingTimesPerWeek: 3,
        weightTrainingIntensity: 'Medium',
        aerobicTrainingAverageTime: 90,
        aerobicTrainingTimesPerWeek: 2,
        aerobicTrainingIntensity: 'Medium'
    },

    int: function (name) {
        return parseInt(this.get(name));
    },

    bmr: function () {
        var basicBmr = (9.99 * this.int('weight')) + (6.25 * this.int('height')) - (4.92 * this.int('age'));
        if (this.get('sex') === 'Male') {
            return basicBmr + 5;
        } else {
            return basicBmr - 161;
        }
    },

    weightTrainingKcal: function () {
        var kcalPerMinMap = {
            'Small': 7,
            'Medium': 8,
            'High': 9
        };
        var kcalPerMin = kcalPerMinMap[this.get('weightTrainingIntensity')];

        var epocMap = {
            'Endomorph': 0.04,
            'Mesomorph': 0.055,
            'Ectomorph': 0.07
        };
        var epoc = epocMap[this.get('bodyType')];

        var timesPerWeek = this.int('weightTrainingTimesPerWeek');

        return (timesPerWeek * this.int('weightTrainingAverageTime') * kcalPerMin) +
            (timesPerWeek * epoc * this.bmr());
    },

    aerobicTrainingKcal: function () {
        var kcalPerMinMap = {
            'Small': 5,
            'Medium': 7.5,
            'High': 10
        };
        var kcalPerMin = kcalPerMinMap[this.get('aerobicTrainingIntensity')];

        var epocMap = {
            'Small': 5,
            'Medium': 35,
            'High': 180
        };
        var epoc = epocMap[this.get('aerobicTrainingIntensity')];

        var timesPerWeek = this.int('aerobicTrainingTimesPerWeek');
        return (timesPerWeek * this.int('aerobicTrainingAverageTime') * kcalPerMin) +
            (timesPerWeek * epoc);
    },

    tea: function () {
        return (this.weightTrainingKcal() + this.aerobicTrainingKcal()) / 7;
    },

    neat: function () {
        var neatMap = {
            'Endomorph': 300,
            'Mesomorph': 450,
            'Ectomorph': 800
        };
        return neatMap[this.get('bodyType')];
    },

    tef: function () {
        return 0.08 * (this.bmr() + this.tea() + this.neat());
    },

    tdee: function () {
        return this.bmr() + this.tea() + this.neat() + this.tef();
    },

    dailyCaloricIntake: function () {
        var dietTargetMap = {
            'Mass gain': 300,
            'Mass loss': -300
        };
        var dietTargetAddition = dietTargetMap[this.get('dietTarget')];

        return this.tdee() + dietTargetAddition;
    }
});