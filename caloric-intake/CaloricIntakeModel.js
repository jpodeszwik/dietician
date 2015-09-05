var CaloricIntake = Backbone.Model.extend({
    defaults: {
        sex: 'Male',
        age: 20,
        height: 180,
        weight: 80,
        bodyType: 'Mesomorph',
        dailyPhysicalActivity: 'Medium',
        dietTarget: 'Mass loss',
        weightTrainingAverageTime: 90,
        weightTrainingTimesPerWeek: 3,
        weightTrainingIntensity: 'Medium',
        aerobicTrainingAverageTime: 30,
        aerobicTrainingTimesPerWeek: 2,
        aerobicTrainingIntensity: 'Medium'
    },

    bmr: function () {
        var basicBmr = (9.99 * this.get('weight')) + (6.25 * this.get('height')) - (4.92 * this.get('age'));
        if (this.get('sex') === 'Male') {
            return basicBmr + 5;
        } else {
            return basicBmr - 161;
        }
    }
});