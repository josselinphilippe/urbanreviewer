var plansmap = require('./plansmap');
var _ = require('underscore');

var eventEmitter = $({}),
    selectedDispositions = [],
    publicVacant = false;

function highlightLots() {
    plansmap.highlightLots({
        dispositions: selectedDispositions,
        public_vacant: publicVacant
    });
}

function getState() {
    var state = {};
    if (selectedDispositions && selectedDispositions.length > 0) {
        state.dispositions = selectedDispositions;
    }
    if (publicVacant) {
        state.public_vacant = publicVacant;
    }
    return state;
}

module.exports = {

    init: function (options, initialState) {
        options = options || {};

        if (options.dispositions) {
            var $dispositions = $(options.dispositions + ' :input');
            $dispositions.change(function () {
                selectedDispositions = _.map($dispositions.filter(':checked'), function (e) { return $(e).data('disposition'); });
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.dispositions) {
                _.each(initialState.dispositions, function (disposition) {
                    $dispositions.filter('[data-disposition="' + disposition + '"]')
                        .prop('checked', true)
                        .trigger('change');
                });
            }
        }

        if (options.public_vacant) {
            var $publicVacant = $(options.public_vacant);
            $publicVacant.change(function () {
                publicVacant = $(this).is(':checked');
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.public_vacant) {
                $publicVacant
                    .prop('checked', initialState.public_vacant)
                    .trigger('change');
            }
        }

        return eventEmitter;
    },

    getDispositions: function() {
        var dispositions = [
            {
                label: 'open space',
                helpText: 'Open space'
            },
            {
                label: 'recreational',
                helpText: 'Recreational'
            },
            {
                label: 'community facility',
                helpText: 'Community facility'
            },
            {
                label: 'residential',
                helpText: 'Residential'
            },
            {
                label: 'commercial',
                helpText: 'Commercial'
            },
            {
                label: 'industrial',
                helpText: 'Industrial'
            },
            {
                label: 'institutional',
                helpText: 'Institutional'
            },
            {
                label: 'public',
                helpText: 'Public'
            },
            {
                label: 'semi-public',
                helpText: 'Semi-public'
            },
            {
                label: 'utility',
                helpText: 'Utility'
            },
            {
                label: 'easement',
                helpText: 'Easement'
            },
            {
                label: 'street',
                helpText: 'Street'
            }
        ];
        return _.map(dispositions, function (disposition) {
            disposition.id = disposition.label.replace(' ', '-');
            return disposition;
        });
    },

    getState: getState

};
